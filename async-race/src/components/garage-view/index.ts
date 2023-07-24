import './garage.scss';
import View from '../view';
import CreateForm from '../create-form';
import UpdateForm from '../update-form';
import { CARS_PER_PAGE, FAIR_CARS_PER_PAGE, RANDOM_CARS_NUMBER } from '../../config';
import CarsList from '../cars-list';
import { dispatch, elt, errorHandler, getRandomColor, getRandomName } from '../../utils';
import { checkExtraHost, createCar, createWinner, getWinner, updateWinner } from '../../api';
import { DriveResult, StatusCodes } from '../../types';

const CssClasses = {
  GARAGE: 'garage',
  BUTTON: 'button',
  START: 'button button--start',
  RESET: 'button button--reset',
  CONTROLS: 'fieldset garage__controls',
  MODAL: 'modal',
  SHOW: 'modal--show',
  FAIR: 'fair',
  FAIR_SHOW: 'fair--show',
};

const BTN_CREATE_CARS_TEXT = `Add ${RANDOM_CARS_NUMBER} cars`;
const BTN_START_RACE_TEXT = 'Race';
const BTN_RESET_RACE_TEXT = 'Reset';
const FAIR_PLAY_TEXT = 'Fair Race (check help)';

async function saveWinner(result: DriveResult): Promise<void> {
  const {
    time,
    car: { id },
  } = result;
  const timeSec = time / 1000;

  const current = await getWinner(id);
  if (current.status === StatusCodes.NOT_FOUND || !current.content) {
    const createResult = await createWinner({ id, wins: 1, time: timeSec });

    if (createResult.status !== StatusCodes.CREATED) {
      throw new Error(`Failed to create a winner`);
    }

    dispatch('winner-create');
    return;
  }

  const { time: currentTime, wins: currentWins } = current.content;
  const updateResult = await updateWinner(id, {
    wins: currentWins + 1,
    time: Math.min(currentTime, timeSec),
  });

  if (updateResult.status !== StatusCodes.OK) {
    throw new Error(`Failed to update winner ${id}`);
  }
  dispatch('winner-update');
}

export default class GarageView extends View {
  #createForm: CreateForm;

  #updateForm: UpdateForm;

  #carsList: CarsList;

  #controls: HTMLFieldSetElement;

  #btnCreateCars: HTMLButtonElement;

  #btnStartRace: HTMLButtonElement;

  #btnResetRace: HTMLButtonElement;

  #modal: HTMLDivElement;

  #fairToggle: HTMLLabelElement;

  #fairCheckbox: HTMLInputElement;

  constructor(tabLabel: string) {
    const { BUTTON, GARAGE, START, RESET, MODAL, FAIR } = CssClasses;

    super(tabLabel);
    this.element.classList.add(GARAGE);

    this.#createForm = new CreateForm();
    this.#updateForm = UpdateForm.getInstance();
    this.#carsList = new CarsList(CARS_PER_PAGE);

    this.#controls = elt<HTMLFieldSetElement>('fieldset', { className: CssClasses.CONTROLS });
    this.#btnCreateCars = elt<HTMLButtonElement>('button', { className: BUTTON }, BTN_CREATE_CARS_TEXT);
    this.#btnStartRace = elt<HTMLButtonElement>('button', { className: START }, BTN_START_RACE_TEXT);
    this.#btnResetRace = elt<HTMLButtonElement>('button', { className: RESET }, BTN_RESET_RACE_TEXT);
    this.#modal = elt<HTMLDivElement>('div', { className: MODAL });
    this.#fairCheckbox = elt<HTMLInputElement>('input', { type: 'checkbox' });
    this.#fairToggle = elt<HTMLLabelElement>('label', { className: FAIR }, this.#fairCheckbox, FAIR_PLAY_TEXT);

    this.addEventListeners();
    this.render();
    this.checkServer().catch(errorHandler);
  }

  private addEventListeners(): void {
    this.#btnCreateCars.addEventListener('click', () => {
      this.createCars().catch(errorHandler);
    });

    this.#btnStartRace.addEventListener('click', () => {
      this.startRace();
    });

    this.#btnResetRace.addEventListener('click', () => {
      this.resetRace().catch(errorHandler);
    });

    this.#fairCheckbox.addEventListener('change', (event) => this.playFair(event));
  }

  private render(): void {
    this.#btnResetRace.disabled = true;
    this.#controls.append(this.#btnStartRace, this.#btnResetRace, this.#btnCreateCars, this.#fairToggle);

    this.element.append(
      this.#createForm.getElement(),
      this.#updateForm.getElement(),
      this.#controls,
      this.#carsList.getElement(),
      this.#modal
    );
  }

  private async createCars(): Promise<void> {
    this.#btnCreateCars.disabled = true;

    const cars = Array(RANDOM_CARS_NUMBER)
      .fill(0)
      .map(() => ({ name: getRandomName(), color: getRandomColor() }));

    const requests = cars.map((car) => createCar(car));
    await Promise.all(requests);

    this.#carsList.updateList();
    this.#btnCreateCars.disabled = false;
  }

  private startRace(): void {
    this.#btnStartRace.disabled = true;
    this.disableControls(true);

    const racers = this.#carsList.getCars().map((car) => car.drive());

    Promise.any(racers)
      .then((result) => {
        this.announceTheWinner(result);
        return saveWinner(result);
      })
      .catch(() => {
        console.log('All cars crashed');
      });

    Promise.allSettled(racers)
      .then(() => {
        this.finishRace();
      })
      .catch(errorHandler);
  }

  private finishRace(): void {
    this.disableControls(false);
    this.#btnResetRace.disabled = false;
  }

  private async resetRace(): Promise<void> {
    this.#btnResetRace.disabled = true;

    this.#modal.classList.remove(CssClasses.SHOW);
    const cars = this.#carsList.getCars().map((car) => car.stop());
    await Promise.all(cars);

    this.#btnStartRace.disabled = false;
  }

  private disableControls(disable: boolean): void {
    this.#carsList.disableControls(disable);
    this.#createForm.disable(disable);
    this.#updateForm.disable(disable);
    this.#controls.disabled = disable;
  }

  private announceTheWinner(result: DriveResult): void {
    const {
      time,
      car: { name },
    } = result;
    const timeSec = (time / 1000).toFixed(2);

    this.#modal.innerHTML = `${name} finished first in ${timeSec}&nbsp;sec`;
    this.#modal.classList.add(CssClasses.SHOW);
  }

  private async checkServer(): Promise<void> {
    const canPlayFair = await checkExtraHost().catch(() => false);

    this.#fairToggle.classList.toggle(CssClasses.FAIR_SHOW, !canPlayFair);
  }

  private playFair(event: Event): void {
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const playFair = target.checked;
    this.#carsList.changePageSize(playFair ? FAIR_CARS_PER_PAGE : CARS_PER_PAGE);
  }
}

import './garage.scss';
import View from '../view';
import CreateForm from '../create-form';
import UpdateForm from '../update-form';
import { CARS_PER_PAGE, RANDOM_CARS_NUMBER } from '../../config';
import CarsList from '../cars-list';
import { elt, errorHandler, getRandomColor, getRandomName } from '../../utils';
import { createCar } from '../../api';

const CssClasses = {
  GARAGE: 'garage',
  BUTTON: 'button',
  START: 'button button--start',
  RESET: 'button button--reset',
  CONTROLS: 'fieldset garage__controls',
};

const BTN_CREATE_CARS_TEXT = `Add ${RANDOM_CARS_NUMBER} cars`;
const BTN_START_RACE_TEXT = 'Race';
const BTN_RESET_RACE_TEXT = 'Reset';

export default class GarageView extends View {
  #createForm: CreateForm;

  #updateForm: UpdateForm;

  #carsList: CarsList;

  #controls: HTMLFieldSetElement;

  #btnCreateCars: HTMLButtonElement;

  #btnStartRace: HTMLButtonElement;

  #btnResetRace: HTMLButtonElement;

  constructor() {
    const { BUTTON, GARAGE, START, RESET } = CssClasses;

    super();
    this.element.classList.add(GARAGE);

    this.#createForm = new CreateForm();
    this.#updateForm = UpdateForm.getInstance();
    this.#carsList = new CarsList(CARS_PER_PAGE);

    this.#controls = elt<HTMLFieldSetElement>('fieldset', { className: CssClasses.CONTROLS });
    this.#btnCreateCars = elt<HTMLButtonElement>('button', { className: BUTTON }, BTN_CREATE_CARS_TEXT);
    this.#btnStartRace = elt<HTMLButtonElement>('button', { className: START }, BTN_START_RACE_TEXT);
    this.#btnResetRace = elt<HTMLButtonElement>('button', { className: RESET }, BTN_RESET_RACE_TEXT);

    this.addEventListeners();
    this.render();
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
  }

  private render(): void {
    this.#btnResetRace.disabled = true;
    this.#controls.append(this.#btnStartRace, this.#btnResetRace, this.#btnCreateCars);

    this.element.append(
      this.#createForm.getElement(),
      this.#updateForm.getElement(),
      this.#controls,
      this.#carsList.getElement()
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

    const racers = this.#carsList.getCars().map((car) => {
      return car.drive();
    });

    Promise.any(racers)
      .then((result) => {
        console.log(result);
      })
      .catch(() => {
        console.log('All cars crashed');
      });

    Promise.allSettled(racers)
      .then((results) => {
        console.log(results);
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
}

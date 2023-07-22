import './car.scss';
import { dispatch, elt, errorHandler } from '../../utils';
import Component from '../component';
import { Car, DriveResult, EngineStatus, StatusCodes } from '../../types';
import { deleteCar, deleteWinner, manipulateEngine } from '../../api';
import UpdateForm from '../update-form';

const CssClasses = {
  CAR: 'car',
  CONTROLS: 'car__controls',
  NAME: 'car__name',
  TRACK: 'car__track',
  IMAGE: 'car__image',
  DRIVE: 'car--drive',
  BUTTON: 'button',
  REMOVE: 'button--remove',
  UPDATE: 'button--update',
  START: 'button--start',
  STOP: 'button--stop',
};

const button = (className: string, text = ''): HTMLButtonElement => {
  const btn = elt<HTMLButtonElement>('button', { className: CssClasses.BUTTON, innerHTML: `<i>${text}</i>` });
  btn.classList.add(className);
  return btn;
};

const BTN_REMOVE_TEXT = 'Remove';
const BTN_UPDATE_TEXT = 'Update';
const BTN_START_TEXT = 'Start';
const BTN_STOP_TEXT = 'Stop';

export default class CarView extends Component<HTMLDivElement> {
  #car: Car;

  #engineStatus: EngineStatus = 'stopped';

  #btnRemove: HTMLButtonElement;

  #btnUpdate: HTMLButtonElement;

  #btnStart: HTMLButtonElement;

  #btnStop: HTMLButtonElement;

  #controlsFieldset: HTMLFieldSetElement;

  #carElement: HTMLDivElement;

  #trackElement: HTMLDivElement;

  constructor(car: Car) {
    const { CAR, UPDATE, REMOVE, START, STOP, CONTROLS, IMAGE } = CssClasses;

    const element = elt<HTMLDivElement>('div', { className: CAR });
    super(element);

    this.#car = car;

    this.#btnRemove = button(REMOVE, BTN_REMOVE_TEXT);
    this.#btnUpdate = button(UPDATE, BTN_UPDATE_TEXT);
    this.#btnStart = button(START, BTN_START_TEXT);
    this.#btnStop = button(STOP, BTN_STOP_TEXT);

    this.#controlsFieldset = elt<HTMLFieldSetElement>('fieldset', { className: CONTROLS });
    this.#carElement = elt<HTMLDivElement>('div', { className: IMAGE });
    this.#carElement.style.backgroundColor = car.color;
    this.#trackElement = elt<HTMLDivElement>('div', { className: CssClasses.TRACK });

    this.addEventListeners();
    this.render();
  }

  private addEventListeners(): void {
    this.#btnRemove.addEventListener('click', () => {
      this.removeCar().catch(errorHandler);
    });
    this.#btnUpdate.addEventListener('click', () => this.updateCar());
    this.#btnStart.addEventListener('click', () => {
      this.drive().catch(errorHandler);
    });
    this.#btnStop.addEventListener('click', () => {
      this.stop().catch(errorHandler);
    });
  }

  private render(): void {
    this.#controlsFieldset.append(this.#btnUpdate, this.#btnRemove, this.#btnStart, this.#btnStop);
    this.#btnStop.disabled = true;

    const carName = elt<HTMLHeadingElement>('h3', { className: CssClasses.NAME }, this.#car.name);

    this.#trackElement.append(this.#carElement);

    this.element.append(carName, this.#controlsFieldset, this.#trackElement);
  }

  private async removeCar(): Promise<void> {
    this.disableControls(true);

    const { id } = this.#car;
    let result = await deleteWinner(id);

    if (result.status === StatusCodes.OK) {
      dispatch('winner-delete', id);
    }

    result = await deleteCar(id);

    if (result.status === StatusCodes.OK) {
      dispatch('car-delete', id);
    }
  }

  private updateCar(): void {
    const updateForm = UpdateForm.getInstance();
    updateForm.loadForm(this.#car);
  }

  public disableControls(disabled = false): void {
    this.#controlsFieldset.disabled = disabled;
  }

  public async drive(): Promise<DriveResult> {
    this.reset();

    const { id } = this.#car;
    let time = -1;
    this.#btnStart.disabled = true;

    const result = await manipulateEngine(id, 'started');
    const { status, content } = result;

    if (status !== StatusCodes.OK) {
      return Promise.reject(new Error('engine malfunction'));
    }
    this.#engineStatus = 'started';

    this.#btnStop.disabled = false;

    if (content) {
      const { velocity, distance } = content;
      time = Math.round(distance / velocity);
      this.run(time);
    }

    const driveResult = await manipulateEngine(id, 'drive');
    if (driveResult.status === StatusCodes.INTERNAL_SERVER_ERROR) {
      this.crash();
      return Promise.reject(new Error('crash'));
    }

    return Promise.resolve({
      time,
      car: this.#car,
    });
  }

  public async stop(): Promise<void> {
    const { id } = this.#car;
    this.#btnStop.disabled = true;

    if (this.#engineStatus !== 'stopped') {
      await manipulateEngine(id, 'stopped');
      this.#engineStatus = 'stopped';
      this.reset();
    }

    this.#btnStart.disabled = false;
  }

  private run(time: number): void {
    this.#carElement.style.left = '100%';
    this.#carElement.style.transitionDuration = `${time}ms`;
    this.element.classList.add(CssClasses.DRIVE);
  }

  private crash(): void {
    const currentLeft = parseInt(getComputedStyle(this.#carElement).left, 10);
    const trackWidth = this.#trackElement.clientWidth;
    this.#carElement.style.left = `${(100 * currentLeft) / trackWidth}%`;
    this.#carElement.style.transition = 'none';
    this.element.classList.remove(CssClasses.DRIVE);
  }

  private reset(): void {
    this.element.classList.remove(CssClasses.DRIVE);
    this.#carElement.style.left = '';
    this.#carElement.style.transition = '';
  }
}

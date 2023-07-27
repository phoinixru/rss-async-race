import './car.scss';
import { dispatch, elt } from '../../utils';
import Component from '../component';
import { Car, DriveResult, ENGINE_STATUS, EngineStatus, StatusCodes } from '../../types';
import { deleteCar, deleteWinner, manipulateEngine } from '../../api';
import UpdateForm from '../update-form';
import carImage from '../../assets/images/car.svg';

const CssClasses = {
  CAR: 'car',
  CONTROLS: 'car__controls',
  NAME: 'car__name',
  TRACK: 'car__track',
  IMAGE: 'car__image',
  RESULT: 'car__result',
  ROAD: 'car__road',
  DRIVE: 'car--drive',
  CRASH: 'car--crash',
  FINISH: 'car--finish',
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

const BTN_REMOVE_TEXT = 'Delete';
const BTN_UPDATE_TEXT = 'Edit';
const BTN_START_TEXT = '⏵︎';
const BTN_STOP_TEXT = '⏹︎';

const MAX_TIME = 10000;
const MAX_BLUR = 15;

export default class CarView extends Component<HTMLDivElement> {
  #car: Car;

  #engineStatus: EngineStatus = ENGINE_STATUS.STOPPED;

  #btnRemove: HTMLButtonElement;

  #btnUpdate: HTMLButtonElement;

  #btnStart: HTMLButtonElement;

  #btnStop: HTMLButtonElement;

  #controlsFieldset: HTMLFieldSetElement;

  #carElement: HTMLDivElement;

  #carImage: SVGElement;

  #trackElement: HTMLDivElement;

  #resultElement: HTMLDivElement;

  #roadElement: HTMLSpanElement;

  #run = 0;

  constructor(car: Car) {
    const { CAR, UPDATE, REMOVE, START, STOP, CONTROLS, IMAGE, TRACK, RESULT } = CssClasses;

    const element = elt<HTMLDivElement>('div', { className: CAR });
    super(element);

    this.#car = car;

    this.#btnRemove = button(REMOVE, BTN_REMOVE_TEXT);
    this.#btnUpdate = button(UPDATE, BTN_UPDATE_TEXT);
    this.#btnStart = button(START, BTN_START_TEXT);
    this.#btnStop = button(STOP, BTN_STOP_TEXT);

    this.#controlsFieldset = elt<HTMLFieldSetElement>('fieldset', { className: CONTROLS });
    this.#carElement = elt<HTMLDivElement>('div', { className: IMAGE });
    this.#carElement.innerHTML = carImage;
    this.#carImage = this.#carElement.firstElementChild as SVGElement;
    this.#carImage.style.fill = car.color;

    this.#trackElement = elt<HTMLDivElement>('div', { className: TRACK });
    this.#resultElement = elt<HTMLDivElement>('div', { className: RESULT });
    this.#roadElement = elt<HTMLSpanElement>('span', { className: CssClasses.ROAD });

    this.addEventListeners();
    this.render();
  }

  private addEventListeners(): void {
    const ignore = (): boolean => false;

    this.#btnRemove.addEventListener('click', () => {
      this.removeCar().catch(ignore);
    });
    this.#btnUpdate.addEventListener('click', () => this.updateCar());
    this.#btnStart.addEventListener('click', () => {
      this.drive().catch(ignore);
    });
    this.#btnStop.addEventListener('click', () => {
      this.stop().catch(ignore);
    });
  }

  private render(): void {
    this.#controlsFieldset.append(this.#btnUpdate, this.#btnRemove, this.#btnStart, this.#btnStop);
    this.#btnStop.disabled = true;

    const carName = elt<HTMLHeadingElement>('h3', { className: CssClasses.NAME }, this.#car.name);

    this.#trackElement.append(this.#carElement);

    this.element.append(carName, this.#controlsFieldset, this.#resultElement, this.#trackElement, this.#roadElement);
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
    const { STARTED, DRIVE } = ENGINE_STATUS;
    const { id } = this.#car;
    const startTime = Date.now();
    this.#btnStart.disabled = true;
    this.#run += 1;
    const currentRun = this.#run;

    this.#engineStatus = STARTED;
    const result = await manipulateEngine(id, STARTED);
    const { status, content } = result;

    if (status !== StatusCodes.OK) {
      return Promise.reject(new Error('engine malfunction'));
    }
    this.#btnStop.disabled = false;

    if (content) {
      const { velocity, distance } = content;
      this.run(Math.round(distance / velocity));
    }

    this.#engineStatus = DRIVE;
    const driveResult = await manipulateEngine(id, DRIVE);
    if (currentRun !== this.#run) {
      return Promise.resolve({ time: -1, car: this.#car });
    }

    if (driveResult.status === StatusCodes.INTERNAL_SERVER_ERROR) {
      this.crash();
      return Promise.reject(new Error('crash'));
    }

    const time = Date.now() - startTime;
    this.finish(time);

    return Promise.resolve({ time, car: this.#car });
  }

  public async stop(): Promise<void> {
    const { id } = this.#car;
    const { STOPPED } = ENGINE_STATUS;
    this.#btnStop.disabled = true;

    await manipulateEngine(id, STOPPED);
    this.#engineStatus = STOPPED;
    this.reset();

    this.#btnStart.disabled = false;
  }

  private run(time: number): void {
    this.#carElement.style.left = '100%';
    this.element.classList.add(CssClasses.DRIVE);
    this.element.style.setProperty('--speed', `${Math.floor(time)}ms`);
    this.blur(time);
  }

  private crash(): void {
    this.#engineStatus = ENGINE_STATUS.STOPPED;

    const currentLeft = parseInt(getComputedStyle(this.#carElement).left, 10);
    const trackWidth = this.#trackElement.clientWidth;
    this.#carElement.style.left = `${(100 * currentLeft) / trackWidth}%`;
    this.#carElement.style.transition = 'none';
    this.element.classList.remove(CssClasses.DRIVE);
    this.element.classList.add(CssClasses.CRASH);
    this.#resultElement.innerHTML = '';
    this.blur();
  }

  private finish(time: number): void {
    if (this.#engineStatus === ENGINE_STATUS.STOPPED) {
      return;
    }

    this.#engineStatus = ENGINE_STATUS.STOPPED;
    this.element.classList.add(CssClasses.FINISH);
    this.#resultElement.innerHTML = (time / 1000).toFixed(2);
    this.blur();
  }

  private reset(): void {
    const { DRIVE, CRASH, FINISH } = CssClasses;
    this.element.classList.remove(DRIVE, CRASH, FINISH);
    this.#carElement.style.left = '';
    this.#carElement.style.transition = '';
    this.#roadElement.style.animation = 'none';
    this.element.style.setProperty('--speed', null);
    requestAnimationFrame(() => {
      this.#roadElement.style.animation = '';
    });
    this.blur();
  }

  private blur(time = 0): void {
    let filter = '';
    if (time) {
      const length = Math.round((MAX_BLUR * (MAX_TIME - time)) / MAX_TIME);
      filter = `drop-shadow(-${length}px 0 3px ${this.#car.color})`;
    }
    this.#carImage.style.filter = filter;
  }

  public getEngineStatus(): EngineStatus {
    return this.#engineStatus;
  }
}

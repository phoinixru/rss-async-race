import './car.scss';
import { elt } from '../../utils';
import Component from '../component';
import { Car } from '../../types';

const CssClasses = {
  CAR: 'car',
  CONTROLS: 'car__controls',
  NAME: 'car__name',
  TRACK: 'car__track',
  IMAGE: 'car__image',
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

  #btnRemove: HTMLButtonElement;

  #btnUpdate: HTMLButtonElement;

  #btnStart: HTMLButtonElement;

  #btnStop: HTMLButtonElement;

  #controlsFieldset: HTMLFieldSetElement;

  #carElement: HTMLDivElement;

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

    this.addEventListeners();
    this.render();
  }

  private addEventListeners(): void {
    this.#btnRemove.addEventListener('click', () => this.removeCar());
    this.#btnUpdate.addEventListener('click', () => this.updateCar());
  }

  private render(): void {
    this.#controlsFieldset.append(this.#btnUpdate, this.#btnRemove, this.#btnStart, this.#btnStop);

    const carName = elt<HTMLHeadingElement>('h3', { className: CssClasses.NAME }, this.#car.name);
    const track = elt<HTMLDivElement>('div', { className: CssClasses.TRACK });

    track.append(this.#carElement);

    this.element.append(carName, this.#controlsFieldset, track);
  }

  private removeCar(): void {
    console.log(this.#car);
  }

  private updateCar(): void {
    console.log(this.#car);
  }
}

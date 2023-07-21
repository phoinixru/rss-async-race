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
  CONTROLS: 'fieldset garage__controls',
};

const BTN_CREATE_CARS_TEXT = `Add ${RANDOM_CARS_NUMBER} cars`;

export default class GarageView extends View {
  #createForm: CreateForm;

  #updateForm: UpdateForm;

  #carsList: CarsList;

  #btnCreateCars: HTMLButtonElement;

  constructor() {
    super();
    this.element.classList.add(CssClasses.GARAGE);

    this.#createForm = new CreateForm();
    this.#updateForm = UpdateForm.getInstance();
    this.#carsList = new CarsList(CARS_PER_PAGE);
    this.#btnCreateCars = elt<HTMLButtonElement>('button', { className: CssClasses.BUTTON }, BTN_CREATE_CARS_TEXT);

    this.addEventListeners();
    this.render();
  }

  private addEventListeners(): void {
    this.#btnCreateCars.addEventListener('click', () => {
      this.createCars().catch(errorHandler);
    });
  }

  private render(): void {
    const controls = elt<HTMLFieldSetElement>('fieldset', { className: CssClasses.CONTROLS });
    controls.append(this.#btnCreateCars);

    this.element.append(
      this.#createForm.getElement(),
      this.#updateForm.getElement(),
      controls,
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
}

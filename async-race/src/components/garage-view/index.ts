import './garage.scss';
import View from '../view';
import CreateForm from '../create-form';
import UpdateForm from '../update-form';
import { CARS_PER_PAGE } from '../../config';
import CarsList from '../cars-list';

const CssClasses = {
  GARAGE: 'garage',
};

export default class GarageView extends View {
  #createForm: CreateForm;

  #updateForm: UpdateForm;

  #carsList: CarsList;

  constructor() {
    super();
    this.element.classList.add(CssClasses.GARAGE);

    this.#createForm = new CreateForm();
    this.#updateForm = UpdateForm.getInstance();
    this.#carsList = new CarsList(CARS_PER_PAGE);

    this.render();
  }

  private render(): void {
    this.element.append(this.#createForm.getElement(), this.#updateForm.getElement(), this.#carsList.getElement());
  }
}

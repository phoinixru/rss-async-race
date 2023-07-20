import './garage.scss';
import View from '../view';
import CreateForm from '../create-form';
import UpdateForm from '../update-form';

const CssClasses = {
  GARAGE: 'garage',
};

export default class GarageView extends View {
  #createForm: CreateForm;

  #updateForm: UpdateForm;

  constructor() {
    super();
    this.element.classList.add(CssClasses.GARAGE);

    this.#createForm = new CreateForm();
    this.#updateForm = new UpdateForm();

    this.render();
  }

  private render(): void {
    this.element.innerHTML = 'Garage';

    this.element.append(this.#createForm.getElement(), this.#updateForm.getElement());
  }
}

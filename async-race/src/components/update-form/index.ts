import { updateCar } from '../../api';
import { Car, StatusCodes } from '../../types';
import { dispatch, elt, errorHandler } from '../../utils';
import Form from '../form';

const CssClasses = {
  CREATE: 'form--update',
  BUTTON_UPDATE: 'button button--update',
};

const BTN_UPDATE_TEXT = 'Update';

export default class UpdateForm extends Form {
  private static instance: UpdateForm;

  #inputId: HTMLInputElement;

  private constructor() {
    super();
    this.element.classList.add(CssClasses.CREATE);
    this.#inputId = elt<HTMLInputElement>('input', { type: 'hidden' });
    this.fieldset.append(this.#inputId);

    const btnUpdate = elt<HTMLButtonElement>('button', { className: CssClasses.BUTTON_UPDATE }, BTN_UPDATE_TEXT);
    btnUpdate.addEventListener('click', () => {
      this.updateCar().catch(errorHandler);
    });

    this.fieldset.append(btnUpdate);
    this.disable();

    this.addEventListeners();
  }

  public static getInstance(): UpdateForm {
    if (!UpdateForm.instance) {
      UpdateForm.instance = new UpdateForm();
    }
    return UpdateForm.instance;
  }

  private addEventListeners(): void {
    document.addEventListener('car-delete', (event) => this.handleCarDelete(event));
  }

  private async updateCar(): Promise<void> {
    const id = +this.#inputId.value;
    const name = this.inputName.value;
    const color = this.inputColor.value;

    this.disable();

    const result = await updateCar(id, { name, color });

    if (result.status === StatusCodes.OK) {
      dispatch('car-update', id);
    }

    this.reset();
  }

  public loadForm(car: Car): void {
    const { id, name, color } = car;

    this.#inputId.value = String(id);
    this.inputName.value = name;
    this.inputColor.value = color;

    this.disable(false);
  }

  private handleCarDelete(event: CustomEvent<number>): void {
    const id = event.detail;
    if (this.#inputId.value === String(id)) {
      this.reset();
      this.disable();
    }
  }

  public disable(disable = true): void {
    if (!disable && !this.#inputId.value) {
      return;
    }

    this.fieldset.disabled = disable;
  }
}

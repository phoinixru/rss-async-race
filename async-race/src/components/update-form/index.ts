import { Car } from '../../types';
import { elt, errorHandler, pause } from '../../utils';
import Form from '../form';

const CssClasses = {
  CREATE: 'form--update',
  BUTTON_UPDATE: 'button button--update',
};

const BTN_UPDATE_TEXT = 'Update';

export default class UpdateForm extends Form {
  #inputId: HTMLInputElement;

  constructor() {
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
  }

  private async updateCar(): Promise<void> {
    const id = +this.#inputId.value;
    const name = this.inputName.value;
    const color = this.inputColor.value;

    this.disable();

    await pause(500);

    console.log(id, name, color);

    this.enable();
    this.reset();
  }

  public loadForm(car: Car): void {
    const { id, name, color } = car;

    this.#inputId.value = String(id);
    this.inputName.value = name;
    this.inputColor.value = color;

    this.enable();
  }
}

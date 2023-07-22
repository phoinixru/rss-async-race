import { createCar } from '../../api';
import { StatusCodes } from '../../types';
import { dispatch, elt, errorHandler, getRandomColor } from '../../utils';
import Form from '../form';

const CssClasses = {
  CREATE: 'form--create',
  BUTTON_CREATE: 'button button--create',
};

const BTN_CREATE_TEXT = 'Create';

export default class CreateForm extends Form {
  constructor() {
    super();
    this.element.classList.add(CssClasses.CREATE);

    const btnCreate = elt<HTMLButtonElement>('button', { className: CssClasses.BUTTON_CREATE }, BTN_CREATE_TEXT);
    btnCreate.addEventListener('click', () => {
      this.createCar().catch(errorHandler);
    });

    const randomColor = getRandomColor();
    this.inputColor.value = randomColor;

    this.fieldset.append(btnCreate);
  }

  private async createCar(): Promise<void> {
    const name = this.inputName.value;
    const color = this.inputColor.value;

    this.disable();

    const result = await createCar({ name, color });
    const { status, message } = result;

    if (status === StatusCodes.CREATED) {
      dispatch('car-add');
    } else {
      console.log(message);
    }

    this.reset();
    this.disable(false);
  }
}

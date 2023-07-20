import './form.scss';
import { elt, getRandomColor, getRandomName } from '../../utils';
import Component from '../component';

const CssClasses = {
  FORM: 'form',
  FIELDSET: 'fieldset',
  INPUT: 'input',
  BUTTON: 'button',
  RANDOM: 'button--random',
};

const ICON_RANDOM = '🎲';

export default class Form extends Component<HTMLFormElement> {
  protected inputName: HTMLInputElement;

  protected inputColor: HTMLInputElement;

  protected fieldset: HTMLFieldSetElement;

  constructor() {
    const form = elt<HTMLFormElement>('form', { className: CssClasses.FORM });
    const preventDefault = (event: SubmitEvent): void => event.preventDefault();
    form.addEventListener('submit', preventDefault);

    super(form);

    this.fieldset = elt<HTMLFieldSetElement>('fieldset', { className: CssClasses.FIELDSET });

    this.inputName = elt<HTMLInputElement>('input', { type: 'text', className: CssClasses.INPUT });
    this.inputColor = elt<HTMLInputElement>('input', { type: 'color', className: CssClasses.INPUT });

    const btnRandom = elt<HTMLButtonElement>('button', { className: CssClasses.BUTTON }, ICON_RANDOM);
    btnRandom.classList.add(CssClasses.RANDOM);
    btnRandom.addEventListener('click', () => this.fillRandom());

    this.fieldset.append(this.inputName, this.inputColor, btnRandom);
    form.append(this.fieldset);
  }

  protected reset(): void {
    this.element.reset();
  }

  protected disable(): void {
    this.fieldset.disabled = true;
  }

  protected enable(): void {
    this.fieldset.disabled = false;
  }

  private fillRandom(): void {
    this.inputColor.value = getRandomColor();
    this.inputName.value = getRandomName();
  }
}

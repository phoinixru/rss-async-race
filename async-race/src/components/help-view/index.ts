import './help.scss';
import View from '../view';

const CssClasses = {
  HELP: 'help',
};

const HTML = `Help Here`;

export default class HelpView extends View {
  constructor(tabLabel: string) {
    super(tabLabel);
    this.element.classList.add(CssClasses.HELP);

    this.render();
  }

  private render(): void {
    this.element.innerHTML = HTML;
  }
}

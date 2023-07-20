import './winners.scss';
import View from '../view';

const CssClasses = {
  WINNERS: 'winners',
};

export default class WinnersView extends View {
  constructor() {
    super();
    this.element.classList.add(CssClasses.WINNERS);

    this.render();
  }

  private render(): void {
    this.element.innerHTML = 'Winners';
  }
}

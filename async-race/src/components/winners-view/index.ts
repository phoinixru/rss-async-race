import View from '../view';
import WinnersList from '../winners-list';
import { WINNERS_PER_PAGE } from '../../config';

const CssClasses = {
  WINNERS: 'winners',
};

export default class WinnersView extends View {
  #winnersList: WinnersList;

  constructor(tabLabel: string) {
    super(tabLabel);
    this.element.classList.add(CssClasses.WINNERS);

    this.#winnersList = new WinnersList(WINNERS_PER_PAGE);

    this.render();
  }

  private render(): void {
    this.element.append(this.#winnersList.getElement());
  }
}

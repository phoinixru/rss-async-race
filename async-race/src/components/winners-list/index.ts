import { getWinners } from '../../api';
import { WINNERS_LIST_TITLE } from '../../config';
import { Winner, StatusCodes, Sort, Order } from '../../types';
import { errorHandler } from '../../utils';
import List from '../list';

const CssClasses = {
  LIST: 'winners-list',
};

export default class WinnersList extends List {
  #winners: Winner[] = [];

  #sort: Sort = 'id';

  #order: Order = 'ASC';

  constructor(perPage: number) {
    super(perPage, WINNERS_LIST_TITLE);
    this.element.classList.add(CssClasses.LIST);
    this.loadWinners().catch(errorHandler);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('winner-delete', () => this.updateList());
  }

  private updateList(): void {
    this.loadWinners().catch(errorHandler);
  }

  private async loadWinners(): Promise<void> {
    const result = await getWinners(this.currentPage, this.perPage, this.#sort, this.#order);
    const { status, message, content, total } = result;

    if (status === StatusCodes.OK && content) {
      this.#winners = content;
      this.totalItems = Number(total);
      this.renderContent();

      return;
    }

    console.log(message);
  }

  private renderContent(): void {
    this.updateCounters();
    this.renderWinners();
  }

  private renderWinners(): void {
    const winnerHtml = (winner: Winner): string => {
      const { id, wins, time } = winner;

      return `<p>${id} - ${wins} - ${time}</p>`;
    };
    const listHtml = this.#winners.map(winnerHtml).join('\n');

    this.contentElement.innerHTML = listHtml;
  }
}

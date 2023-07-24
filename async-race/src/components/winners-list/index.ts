import './winners.scss';
import { getCar, getWinners } from '../../api';
import { WINNERS_LIST_TITLE } from '../../config';
import { Winner, StatusCodes, Sort, Order, Car } from '../../types';
import { assign, elt, entries, errorHandler, keys } from '../../utils';
import List from '../list';
import carImage from '../../assets/images/car.svg';

const CssClasses = {
  LIST: 'winners-list',
  TH: 'th',
  TD: 'td',
  SORTABLE: 'th--sortable',
  ASC: 'th--asc',
  DESC: 'th--desc',
  TABLE: 'table',
  CAR: 'car__image',
};

const HEADERS = {
  idx: '#',
  car: 'Car',
  name: 'Name',
  wins: 'Wins',
  time: 'Best time (s)',
};

const SORT_FIELDS = ['wins', 'time'];
const DEFAULT_SORT_FIELD = 'id';
const DEFAULT_SORT_ORDER: Record<Sort, Order> = {
  id: 'ASC',
  wins: 'DESC',
  time: 'ASC',
};

function isSortField(id: string): id is Sort {
  return keys(DEFAULT_SORT_ORDER).includes(id);
}

const trElement = (cells: HTMLTableCellElement[]): HTMLTableRowElement => elt('tr', null, ...cells);
const thElement = (content: string): HTMLTableCellElement =>
  elt<HTMLTableCellElement>('th', { className: CssClasses.TH, innerHTML: content });
const tdElement = (field: string, content: string): HTMLTableCellElement =>
  elt('td', { innerHTML: content, className: `${CssClasses.TD} ${CssClasses.TD}--${field}` });

const getCarHtml = (color: string): string => {
  const carElement = elt<HTMLDivElement>('div', { className: CssClasses.CAR, innerHTML: carImage });
  const svg = carElement.firstElementChild;
  if (svg instanceof SVGElement) {
    svg.style.fill = color;
  }
  return carElement.outerHTML;
};
export default class WinnersList extends List {
  #winners: Winner[] = [];

  #sort: Sort = 'id';

  #order: Order = 'ASC';

  #cars: Record<number, Car> = {};

  constructor(perPage: number) {
    super(perPage, WINNERS_LIST_TITLE);
    this.element.classList.add(CssClasses.LIST);

    this.pagination.onChange((page) => this.changePage(page));
    this.loadWinners().catch(errorHandler);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('winner-create', () => this.updateList());
    document.addEventListener('winner-update', () => this.updateList());
    document.addEventListener('winner-delete', () => this.updateList());
    document.addEventListener('car-update', (event) => this.handleCarUpdate(event));
    this.contentElement.addEventListener('click', (event) => this.handleClicks(event));
  }

  private updateList(): void {
    this.loadWinners().catch(errorHandler);
  }

  private async loadWinners(): Promise<void> {
    const result = await getWinners(this.currentPage, this.perPage, this.#sort, this.#order);
    const { status, message, content, total } = result;

    if (status === StatusCodes.OK && content) {
      this.#cars = (await Promise.all(content.map(({ id }) => getCar(id)))).reduce((acc, response) => {
        const car = response.content;
        if (car) {
          assign(acc, { [car.id]: car });
        }
        return acc;
      }, {});

      this.#winners = content;
      this.totalItems = Number(total);

      this.renderContent();

      return;
    }

    console.log(message);
  }

  private renderContent(): void {
    this.updateCounters();
    this.updatePagination();
    this.renderWinners();
  }

  private renderWinners(): void {
    const { SORTABLE, ASC, DESC, TABLE } = CssClasses;

    const table = elt('table', { className: TABLE });
    const ths = entries(HEADERS).map(([id, label]) => {
      const element = thElement(label);
      if (SORT_FIELDS.includes(id)) {
        element.classList.add(SORTABLE);
        element.dataset.sort = id;
      }
      if (id === this.#sort) {
        element.classList.add(this.#order === 'ASC' ? ASC : DESC);
      }
      return element;
    });
    table.append(trElement(ths));

    this.#winners.forEach((winner, idx) => {
      const { id, wins, time } = winner;
      const { name, color } = this.#cars[id];
      const data: Record<string, string> = {
        idx: String(idx + 1),
        car: getCarHtml(color),
        name,
        wins: `${wins}`,
        time: time.toFixed(2),
      };
      const tds = keys(HEADERS).map((fieldId) => tdElement(fieldId, String(data[fieldId])));

      table.append(trElement(tds));
    });

    this.contentElement.innerHTML = '';
    this.contentElement.append(table);
  }

  private handleCarUpdate(event: CustomEvent<number>): void {
    const updateId = event.detail;
    if (!this.#winners.find(({ id }) => id === updateId)) {
      return;
    }

    this.updateList();
  }

  private changePage(pageNumber: number): void {
    if (this.currentPage === pageNumber) {
      return;
    }

    this.currentPage = pageNumber;
    this.loadWinners().catch(errorHandler);
  }

  private handleClicks(event: MouseEvent): void {
    const { target } = event;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const th = target.closest(`.${CssClasses.SORTABLE}`);
    if (!(th instanceof HTMLElement)) {
      return;
    }
    const sortId = th.dataset.sort || DEFAULT_SORT_FIELD;
    if (!isSortField(sortId)) {
      return;
    }

    if (this.#sort === sortId) {
      this.#order = this.#order === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.#sort = sortId;
      this.#order = DEFAULT_SORT_ORDER[sortId];
    }

    this.updateList();
  }
}

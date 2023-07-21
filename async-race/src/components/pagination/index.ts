import { elt } from '../../utils';
import Component from '../component';
import './pagination.scss';

const CssClasses = {
  PAGINATION: 'pagination',
  FIELDSET: 'pagination__fieldset',
  BUTTON: 'button',
  BUTTON_PREV: 'button--prev',
  BUTTON_NEXT: 'button--next',
};

const BTN_NEXT_TEXT = 'Next';
const BTN_PREV_TEXT = 'Prev';

type PageChangeListener = (page: number) => void;

export default class Pagination extends Component<HTMLFieldSetElement> {
  #btnPrev: HTMLButtonElement;

  #btnNext: HTMLButtonElement;

  #currentPage = 1;

  #totalPages = 0;

  #perPage: number;

  #subscribers: PageChangeListener[] = [];

  constructor(perPage: number) {
    const { PAGINATION, BUTTON, BUTTON_NEXT, BUTTON_PREV } = CssClasses;

    const element = elt<HTMLFieldSetElement>('fieldset', { className: PAGINATION });
    super(element);

    this.#perPage = perPage;

    this.#btnPrev = elt<HTMLButtonElement>('button', { className: BUTTON }, BTN_PREV_TEXT);
    this.#btnPrev.classList.add(BUTTON_PREV);
    this.#btnNext = elt<HTMLButtonElement>('button', { className: BUTTON }, BTN_NEXT_TEXT);
    this.#btnNext.classList.add(BUTTON_NEXT);

    this.render();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.#btnPrev.addEventListener('click', () => this.prevPage());
    this.#btnNext.addEventListener('click', () => this.nextPage());
  }

  private render(): void {
    this.element.append(this.#btnPrev, this.#btnNext);
    this.updateButtons();
  }

  public updateCounts(totalItems: number): void {
    this.#totalPages = Math.ceil(totalItems / this.#perPage);
    if (this.#currentPage > this.#totalPages) {
      this.#currentPage = this.#totalPages;
      this.setPage();
    }
    this.updateButtons();
  }

  private updateButtons(): void {
    this.#btnPrev.disabled = this.#currentPage === 1;
    this.#btnNext.disabled = this.#currentPage >= this.#totalPages;
  }

  private prevPage(): void {
    this.#currentPage = Math.max(1, this.#currentPage - 1);
    this.setPage();
  }

  private nextPage(): void {
    this.#currentPage = Math.min(this.#totalPages, this.#currentPage + 1);
    this.setPage();
  }

  private setPage(): void {
    this.#subscribers.forEach((func) => {
      func(this.#currentPage);
    });

    this.updateButtons();
  }

  public onChange(func: PageChangeListener): void {
    this.#subscribers.push(func);
  }

  public disable(disabled: boolean): void {
    this.element.disabled = disabled;
  }
}

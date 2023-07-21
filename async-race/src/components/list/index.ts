import { elt } from '../../utils';
import Component from '../component';

const CssClasses = {
  LIST: 'list',
  TITLE: 'list__title',
  PAGE: 'list__page',
  CONTENT: 'list__content',
};

export default class List extends Component<HTMLDivElement> {
  protected currentPage = 1;

  protected perPage: number;

  protected totalItems: number;

  #title: string;

  #titleElement: HTMLHeadingElement;

  #pageElement: HTMLElement;

  protected contentElement: HTMLDivElement;

  constructor(perPage: number, title: string) {
    const element = elt<HTMLDivElement>('div', { className: CssClasses.LIST });
    super(element);

    this.perPage = perPage;
    this.totalItems = 0;
    this.#title = title;

    this.#titleElement = elt<HTMLHeadingElement>('h2', { className: CssClasses.TITLE });
    this.#pageElement = elt<HTMLElement>('div', { className: CssClasses.PAGE });
    this.contentElement = elt<HTMLDivElement>('div', { className: CssClasses.CONTENT });

    this.render();
  }

  private render(): void {
    this.element.append(this.#titleElement, this.#pageElement, this.contentElement);

    this.updateCounters();
  }

  protected updateCounters(): void {
    this.#titleElement.innerHTML = `${this.#title} (${this.totalItems})`;
    this.#pageElement.innerHTML = `Page #${this.currentPage}`;
  }
}

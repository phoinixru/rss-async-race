import { getCars } from '../../api';
import { CARS_LIST_TITLE } from '../../config';
import { Car, StatusCodes } from '../../types';
import { errorHandler } from '../../utils';
import CarView from '../car-view';
import List from '../list';

const CssClasses = {
  LIST: 'cars-list',
};

export default class CarsList extends List {
  #cars: Car[] = [];

  constructor(perPage: number) {
    super(perPage, CARS_LIST_TITLE);
    this.element.classList.add(CssClasses.LIST);

    this.pagination.onChange((page) => this.changePage(page));
    this.loadCars().catch(errorHandler);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('car-add', () => this.updateList());
    document.addEventListener('car-update', (event) => this.handleCarUpdate(event));
    document.addEventListener('car-delete', () => this.updateList());
  }

  private updateList(): void {
    this.loadCars().catch(errorHandler);
  }

  private async loadCars(): Promise<void> {
    const result = await getCars(this.currentPage, this.perPage);
    const { status, message, content, total } = result;

    if (status === StatusCodes.OK && content) {
      this.#cars = content;
      this.totalItems = Number(total);
      this.renderContent();

      return;
    }

    console.log(message);
  }

  private renderContent(): void {
    this.updateCounters();
    this.updatePagination();
    this.renderCars();
  }

  private renderCars(): void {
    [...this.contentElement.children].forEach((node) => node.remove());

    this.#cars.forEach((car) => {
      const carView = new CarView(car);
      this.contentElement.append(carView.getElement());
    });
  }

  private handleCarUpdate(event: CustomEvent<number>): void {
    const updateId = event.detail;
    if (!this.#cars.find(({ id }) => id === updateId)) {
      return;
    }

    this.updateList();
  }

  private changePage(pageNumber: number): void {
    if (this.currentPage === pageNumber) {
      return;
    }

    this.currentPage = pageNumber;
    this.loadCars().catch(errorHandler);
  }
}

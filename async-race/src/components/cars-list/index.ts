import './cars.scss';
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
  #carsData: Car[] = [];

  #cars: CarView[] = [];

  constructor(perPage: number) {
    super(perPage, CARS_LIST_TITLE);
    this.element.classList.add(CssClasses.LIST);

    this.pagination.onChange((page) => this.changePage(page));
    this.loadCars().catch(errorHandler);

    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('car-create', () => this.updateList());
    document.addEventListener('car-update', (event) => this.handleCarUpdate(event));
    document.addEventListener('car-delete', () => this.updateList());
  }

  public updateList(): void {
    this.loadCars().catch(errorHandler);
  }

  private async loadCars(): Promise<void> {
    const result = await getCars(this.currentPage, this.perPage);
    const { status, message, content, total } = result;

    if (status === StatusCodes.OK && content) {
      this.#carsData = content;
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
    this.#cars.length = 0;
    [...this.contentElement.children].forEach((node) => node.remove());

    this.#carsData.forEach((car) => {
      const carView = new CarView(car);
      this.#cars.push(carView);
      this.contentElement.append(carView.getElement());
    });
  }

  private handleCarUpdate(event: CustomEvent<number>): void {
    const updateId = event.detail;
    if (!this.#carsData.find(({ id }) => id === updateId)) {
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

  public getCars(): CarView[] {
    return this.#cars;
  }

  public disableControls(disable: boolean): void {
    this.#cars.forEach((car) => car.disableControls(disable));
    this.pagination.disable(disable);
  }
}

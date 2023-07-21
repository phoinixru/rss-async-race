import { getCars } from '../../api';
import { CARS_LIST_TITLE } from '../../config';
import { Car, StatusCodes } from '../../types';
import { errorHandler } from '../../utils';
import List from '../list';

const CssClasses = {
  LIST: 'cars-list',
};

export default class CarsList extends List {
  #cars: Car[] = [];

  constructor(perPage: number) {
    super(perPage, CARS_LIST_TITLE);
    this.element.classList.add(CssClasses.LIST);
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
    this.renderCars();
  }

  private renderCars(): void {
    const carHtml = (car: Car): string => `<p style="color: ${car.color}">${car.name}</p>`;
    const listHtml = this.#cars.map(carHtml).join('\n');

    this.contentElement.innerHTML = listHtml;
  }
}

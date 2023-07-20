import './garage.scss';
import View from '../view';

const CssClasses = {
  GARAGE: 'garage',
};

export default class GarageView extends View {
  constructor() {
    super();
    this.element.classList.add(CssClasses.GARAGE);

    this.render();
  }

  private render(): void {
    this.element.innerHTML = 'Garage';
  }
}

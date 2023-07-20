import Footer from './components/footer';
import GarageView from './components/garage-view';
import Header from './components/header';
import WinnersView from './components/winners-view';
import { App } from './types';
import { elt } from './utils';

const CssClasses = {
  APP: 'app',
  WRAPPER: 'wrapper',
  MAIN: 'main',
  BUTTONS: 'buttons',
  BUTTON: 'button',
};

const BTN_GARAGE_TEXT = 'To Garage';
const BTN_WINNERS_TEXT = 'To Winners';

type ViewId = 'garage' | 'winners';

export default class AsyncRace implements App {
  #wrapper: HTMLDivElement;

  #views: {
    garage: GarageView;
    winners: WinnersView;
  };

  constructor() {
    this.#wrapper = elt<HTMLDivElement>('div', { className: CssClasses.WRAPPER });

    this.#views = {
      garage: new GarageView(),
      winners: new WinnersView(),
    };
  }

  public start(): void {
    const { APP, MAIN, BUTTONS, BUTTON } = CssClasses;
    this.#wrapper.classList.add(APP);

    const mainElement = elt<HTMLElement>('main', { className: MAIN });
    const buttons = elt<HTMLDivElement>('div', { className: BUTTONS });
    const btnGarage = elt<HTMLButtonElement>('button', { className: BUTTON }, BTN_GARAGE_TEXT);
    const btnWinners = elt<HTMLButtonElement>('button', { className: BUTTON }, BTN_WINNERS_TEXT);

    btnGarage.addEventListener('click', () => this.toggleView('garage'));
    btnWinners.addEventListener('click', () => this.toggleView('winners'));

    buttons.append(btnGarage, btnWinners);

    const header = new Header();
    const footer = new Footer();

    mainElement.append(buttons, this.#views.garage.getElement(), this.#views.winners.getElement());

    this.#wrapper.append(header.getElement(), mainElement, footer.getElement());
    document.body.append(this.#wrapper);

    this.toggleView('garage');
  }

  private toggleView(viewId: ViewId): void {
    Object.values(this.#views).forEach((view) => {
      view.hide();
    });

    this.#views[viewId].show();
  }
}

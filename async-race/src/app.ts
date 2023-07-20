import Footer from './components/footer';
import Header from './components/header';
import { App } from './types';
import { elt } from './utils';

const CssClasses = {
  APP: 'app',
  WRAPPER: 'wrapper',
  MAIN: 'main',
};

export default class AsyncRace implements App {
  #wrapper: HTMLDivElement;

  constructor() {
    this.#wrapper = elt<HTMLDivElement>('div', { className: CssClasses.WRAPPER });
  }

  public start(): void {
    const { APP, MAIN } = CssClasses;
    this.#wrapper.classList.add(APP);

    const mainElement = elt<HTMLElement>('main', { className: MAIN });

    const header = new Header();
    const footer = new Footer();

    this.#wrapper.append(header.getElement(), mainElement, footer.getElement());
    document.body.append(this.#wrapper);
  }
}

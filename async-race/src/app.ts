import { App } from './types';
import { elt } from './utils/utils';

const CssClasses = {
  APP: 'app',
  WRAPPER: 'wrapper',
  HEADER: 'header',
  MAIN: 'main',
  FOOTER: 'footer',
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

    this.#wrapper.append(mainElement);
    document.body.append(this.#wrapper);
  }
}

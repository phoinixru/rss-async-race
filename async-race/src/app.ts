import Footer from './components/footer';
import GarageView from './components/garage-view';
import Header from './components/header';
import HelpView from './components/help-view';
import WinnersView from './components/winners-view';
import { App } from './types';
import { assign, elt, entries } from './utils';

const CssClasses = {
  APP: 'app',
  WRAPPER: 'wrapper',
  MAIN: 'main',
  TABS: 'tabs',
  TAB_LABEL: 'tab-label',
  BUTTON: 'button',
};

const DEFAULT_VIEW = 'garage';
const LABEL_GARAGE = 'To garage';
const LABEL_WINNERS = 'To winners';
const LABEL_HELP = 'Fair?';

type ViewId = 'garage' | 'winners' | 'help';

export default class AsyncRace implements App {
  #wrapper: HTMLDivElement;

  #views: {
    garage: GarageView;
    winners: WinnersView;
    help: HelpView;
  };

  constructor() {
    this.#wrapper = elt<HTMLDivElement>('div', { className: CssClasses.WRAPPER });

    this.#views = {
      garage: new GarageView(LABEL_GARAGE),
      winners: new WinnersView(LABEL_WINNERS),
      help: new HelpView(LABEL_HELP),
    };
  }

  public start(): void {
    const { APP, MAIN, TABS, TAB_LABEL } = CssClasses;
    this.#wrapper.classList.add(APP);

    const mainElement = elt<HTMLElement>('main', { className: MAIN });
    const tabs = elt<HTMLDivElement>('div', { className: TABS });
    entries(this.#views).forEach(([id, view]) => {
      const input = elt<HTMLInputElement>('input', { type: 'radio' });
      assign(input, { name: 'view', value: id, id: `view-${id}`, checked: id === DEFAULT_VIEW });

      const label = elt<HTMLLabelElement>('label', { className: TAB_LABEL }, view.getTabLabel());
      label.htmlFor = `view-${id}`;
      tabs.append(input, label);
    });

    tabs.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      const viewId = input.value as ViewId;
      this.toggleView(viewId);
    });

    const header = new Header();
    const footer = new Footer();

    mainElement.append(tabs, this.#views.garage.getElement(), this.#views.winners.getElement());

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

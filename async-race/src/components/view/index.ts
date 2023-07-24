import './view.scss';
import { elt } from '../../utils';
import Component from '../component';

const CssClasses = {
  VIEW: 'view',
  HIDDEN: 'view--hidden',
};

export default class View extends Component<HTMLDivElement> {
  #tabLabel: string;

  constructor(tabLabel: string) {
    const element = elt<HTMLDivElement>('div', { className: CssClasses.VIEW });
    super(element);
    this.#tabLabel = tabLabel;
  }

  public hide(): void {
    this.element.classList.toggle(CssClasses.HIDDEN, true);
  }

  public show(): void {
    this.element.classList.toggle(CssClasses.HIDDEN, false);
  }

  public getTabLabel(): string {
    return this.#tabLabel;
  }
}

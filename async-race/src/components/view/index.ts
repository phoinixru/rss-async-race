import './view.scss';
import { elt } from '../../utils';
import Component from '../component';

const CssClasses = {
  VIEW: 'view',
  HIDDEN: 'view--hidden',
};

export default class View extends Component<HTMLDivElement> {
  constructor() {
    const element = elt<HTMLDivElement>('div', { className: CssClasses.VIEW });
    super(element);
  }

  public hide(): void {
    this.element.classList.toggle(CssClasses.HIDDEN, true);
  }

  public show(): void {
    this.element.classList.toggle(CssClasses.HIDDEN, false);
  }
}

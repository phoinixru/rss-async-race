import './header.scss';
import { MAIN_TITLE } from '../../config';
import { elt } from '../../utils';
import Component from '../component';

const CssClasses = {
  HEADER: 'header',
  TITLE: 'header__title',
};

export default class Header extends Component<HTMLHeadingElement> {
  constructor() {
    super(elt<HTMLHeadingElement>('header', { className: CssClasses.HEADER }));
    this.render();
  }

  private render(): void {
    this.element.append(elt<HTMLElement>('h1', { className: CssClasses.TITLE }, MAIN_TITLE));
  }
}

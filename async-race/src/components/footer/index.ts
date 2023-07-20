import './footer.scss';
import { GITHUB_LINK, GITHUB_NAME, RSSCHOOL_LINK } from '../../config';
import { elt } from '../../utils';
import Component from '../component';

const CssClasses = {
  FOOTER: 'footer',
  GH_LINK: 'github',
  RS_LINK: 'rsschool',
};

const html = `\
<p>
  <a class="${CssClasses.RS_LINK}" href="${RSSCHOOL_LINK}" target="_blank"></a>
</p>
<p>
  Created by <em>Vitaly Kukushkin</em>
  (<a class="${CssClasses.GH_LINK}" href="${GITHUB_LINK}" target="_blank">${GITHUB_NAME}</a>), 2023
</p>`;

export default class Footer extends Component<HTMLElement> {
  constructor() {
    super(elt<HTMLElement>('footer', { className: CssClasses.FOOTER }));
    this.render();
  }

  private render(): void {
    this.element.innerHTML = html;
  }
}

import './help.scss';
import View from '../view';
import firstImage from '../../assets/images/starting_engine.png';

const CssClasses = {
  HELP: 'help',
};

const HTML = `<h2>What's not fair?</h2>
<p>
  In the original task 7 cars on garage page can participate in the race.
  Unfortunately Google Chrome can handle up to 6 concurrent requests to 
  one host. So one of the car has to wait before it can even start an engine.
</p>
<p>
  Here is an example:<br>
  <img src="${firstImage}" alt="Starting engine">
</p>
<p>
  Here car number seven has to wait until all other 6 cars start their engines
  before it can start it's own.
</p>
<p>
  Same problem occurs for the race itself. Car number 6 has to wait before server
  can accept drive-request. And car number 7 has to wait until two other cars finish
  the race before sending drive-request.
</p>

<h2>Make Async Race fair again!</h2>
<p>
  Luckily we can access local server via host name and IP-address:
  <code>localhost</code> and <code>127.0.0.1</code>
</p>
<p>This allows us to sidestep 6-connections limitation and make the race fair.</p>

<h2>What if I can't access server with IP-address?</h2>
<p>Then we have to limit garage page to 6 cars.</p>
<p>If you see "Fair race" checkbox on garage page, that is how you can do exactly this!</p>
<p>Happy fair racing!</p>`;

export default class HelpView extends View {
  constructor(tabLabel: string) {
    super(tabLabel);
    this.element.classList.add(CssClasses.HELP);

    this.render();
  }

  private render(): void {
    this.element.innerHTML = HTML;
  }
}

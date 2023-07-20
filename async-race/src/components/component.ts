export default class Component<T extends HTMLElement> {
  protected element: T;

  constructor(element: T) {
    this.element = element;
  }

  public getElement(): T {
    return this.element;
  }
}

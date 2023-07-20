import { ElementProps } from '../types';

type Parent = HTMLElement | Document | DocumentFragment;

const qs = <T extends HTMLElement>(selector: string, element: Parent = document): T | null => {
  return element.querySelector<T>(selector);
};

const qsa = <T extends HTMLElement>(selector: string, element: Parent = document): T[] => {
  return [...element.querySelectorAll<T>(selector)];
};

type ElementChild = ChildNode | string;
function elt<T extends HTMLElement>(type: string, props?: ElementProps, ...children: ElementChild[]): T {
  const dom = document.createElement(type) as T;
  if (props) {
    Object.assign(dom, props);
  }

  children.forEach((child) => {
    if (typeof child !== 'string') dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  });

  return dom;
}

const { keys, values, assign, entries, fromEntries } = Object;
export { qs, qsa, elt, keys, values, assign, entries, fromEntries };

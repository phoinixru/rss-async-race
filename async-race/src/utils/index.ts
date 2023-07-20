import { ElementProps } from '../types';
import { MAKES, MODELS } from '../config';

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

const pause = (msec: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, msec, `pause ${msec}`);
  });

const errorHandler = (error: Error): void => console.error(error);

const randomByte = (): number => Math.floor(Math.random() * 256);
const toHex = (number: number): string => number.toString(16).padStart(2, '0');
const getRandomColor = (): string => `#${Array(3).fill(0).map(randomByte).map(toHex).join('')}`;

const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomName = (): string => {
  const model = getRandomElement(MODELS);
  const make = getRandomElement(MAKES);

  return `${make} ${model}`;
};

const { keys, values, assign, entries, fromEntries } = Object;
export { qs, qsa, elt, keys, values, assign, entries, fromEntries, pause, errorHandler, getRandomColor, getRandomName };

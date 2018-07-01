export interface IAnyFunction {(...args: any[]): any}
export interface IAnyObject {[key: string]: any}
export interface IRgb {
  [index: number]: number
}

export interface ICanvasqContextEventData {
  propKey: string,
  propVal: any
}

export interface ICanvasqEvent {}

export interface ICanvasqContext {
  query: (className: string) => ICanvasqElement | null,
  destroy: () => void,
  queryAll: (className: string | undefined) => ICanvasqElementCollection,
  subscribe: (eventName: string) => void,
}

export interface ICanvasqElement {
  // eventMap: {[key: string]: IAnyFunction[]}
  // getState: (stateKey: string) => any,
  // setState: (stateKey: string, stateValue: any) => CanvasqContext,
  // getAttribute: (attributeKey: string) => any,
  // setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  // addClassName: (...classNames: string[]) => CanvasqContext,
  // removeClassName: (...classNames: string[]) => CanvasqContext,
  // addEventListener: (
  //   eventName: string,
  //   callback: (evt: ICanvasqEvent) => void,
  //   useCapture: boolean) => ICanvasqContext,
  // trigger: (eventName: string) => CanvasqContext
}

export interface ICanvasqElementCollection {
  isEmpty: () => boolean,
  query: (className: string) => ICanvasqElement | null,
  queryAll: (className?: string) => ICanvasqElementCollection,
  // getState: (stateKey: string) => any,
  // setState: (stateKey: string, stateValue: any) => CanvasqContext,
  // getAttribute: (attributeKey: string) => any,
  // setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  // addClassName: (...classNames: string[]) => CanvasqContext,
  // removeClassName: (...classNames: string[]) => CanvasqContext,
  // addEventListener: (
  //   eventName: string,
  //   callback: (evt: CanvasqEventInterface) => void,
  //   useCapture: boolean) => CanvasqContext
}

export interface ICanvasqElementCollectionOptions {
  canvasqContext: ICanvasqContext
}

export interface ICanvasqElementOptions {
  canvasqContext: ICanvasqContext,
  states?: object,
  attributes?: object
}

export interface ICanvasqListeningEvent {
  eventName: string,
  callback: IAnyFunction
}

/**
 * Enum for canvasq event names
 */
// export enum CanvasqEventType {
//   ContextDrawn,
//   ContextPathUpdate,
// }

export enum CanvasqContextHookType {
  ContextDrawn,
  ContextPathUpdate,
}

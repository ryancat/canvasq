export interface IAnyFunction {(...args: any[]): any}
export interface IAnyObject {[key: string]: any}
export interface IRgb {
  [index: number]: number
}

export interface ICanvasqContextEventData {
  propKey: string,
  propVal: any
}

export interface ICanvasqContext {
  context: CanvasRenderingContext2D,
  query: (collectionKey: string) => ICanvasqElement | null,
  destroy: () => void,
  queryAll: (collectionKey?: string) => ICanvasqElementCollection,
  subscribe: (eventName: string) => void,
  addToCollection: (collectionKey: string, item: ICanvasqElement | ICanvasqElementCollection) => ICanvasqContext,
}

export interface ICanvasqElement {
  canvasqContext: ICanvasqContext,
  eventMap: {[key: string]: IAnyFunction[]},
  /**
   * captureEventMap stores event callbacks for given event in capture phase
   */
  captureEventMap: {[key: string]: IAnyFunction[]},
  key: string,
  addToCollection: (collectionKey: string) => ICanvasqElement,
  fire: (eventName: string, eventData?: any, isCapturePhase?: boolean) => ICanvasqElement,
  // eventMap: {[key: string]: IAnyFunction[]}
  // getState: (stateKey: string) => any,
  // setState: (stateKey: string, stateValue: any) => CanvasqContext,
  // getAttribute: (attributeKey: string) => any,
  // setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  // addcollectionKey: (...collectionKeys: string[]) => CanvasqContext,
  // removecollectionKey: (...collectionKeys: string[]) => CanvasqContext,
  // addEventListener: (
  //   eventName: string,
  //   callback: (evt: ICanvasqEvent) => void,
  //   useCapture: boolean) => ICanvasqContext,
  // trigger: (eventName: string) => CanvasqContext
}

export interface ICanvasqElementCollection {
  // canvasqContext: ICanvasqContext,
  // /**
  //  * eventMap stores event callbacks for given event in buble phase
  //  */
  // eventMap: {[key: string]: IAnyFunction[]},
  // /**
  //  * captureEventMap stores event callbacks for given event in capture phase
  //  */
  // captureEventMap: {[key: string]: IAnyFunction[]},
  // cqCollectionMap: {[key: string]: ICanvasqElementCollection},
  // cqElementMap: {[key: string]: ICanvasqElement},
  [key: number]: ICanvasqElement,

  isEmpty: () => boolean,
  query: (collectionKey: string) => ICanvasqElement | null,
  queryAll: (collectionKey?: string) => ICanvasqElementCollection,
  addToCollection: (collectionKey: string, item: ICanvasqElement | ICanvasqElementCollection) => ICanvasqElementCollection,
  add: (canvasqElement: ICanvasqElement) => ICanvasqElementCollection,
  fire: (eventName: string, eventData?: any, isCapturePhase?: boolean) => ICanvasqElementCollection,
  // getState: (stateKey: string) => any,
  // setState: (stateKey: string, stateValue: any) => CanvasqContext,
  // getAttribute: (attributeKey: string) => any,
  // setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  // addcollectionKey: (...collectionKeys: string[]) => CanvasqContext,
  // removecollectionKey: (...collectionKeys: string[]) => CanvasqContext,
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

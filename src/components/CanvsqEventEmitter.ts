import {
  CanvasqEventType,
  IAnyFunction,
  ICanvasqEventData,
} from './types'

export default class CanvasqEventEmitter {

  public eventMap: {[key: string]: IAnyFunction[]}

  constructor() {
    this.eventMap = {}
  }

  public fire(eventName: CanvasqEventType, eventData?: ICanvasqEventData) {
    const eventCallbacks: IAnyFunction[] = this.eventMap[eventName]
    if (eventCallbacks && eventCallbacks.length) {
      eventCallbacks.forEach((eventCallback) => eventCallback(eventData))
    }
  }

  public on(eventName: CanvasqEventType, callback: IAnyFunction) {
    this.eventMap[eventName] = this.eventMap[eventName] || []
    if (this.eventMap[eventName].indexOf(callback) === -1) {
      this.eventMap[eventName].push(callback)
    }
  }
}

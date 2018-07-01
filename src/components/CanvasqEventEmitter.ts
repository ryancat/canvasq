import {
  IAnyFunction,
  ICanvasqContext,
} from './types'

export default abstract class CanvasqEventEmitter {
  /**
   * eventMap stores event callbacks for given event in buble phase
   */
  public eventMap: {[key: string]: IAnyFunction[]}
  /**
   * captureEventMap stores event callbacks for given event in capture phase
   */
  public captureEventMap: {[key: string]: IAnyFunction[]}

  public abstract canvasqContext: ICanvasqContext

  constructor() {
    this.eventMap = {}
    this.captureEventMap = {}
  }

  public fire(eventName: string, eventData?: any, isCapturePhase?: boolean): CanvasqEventEmitter {
    const eventCallbacks: IAnyFunction[] = isCapturePhase ? this.captureEventMap[eventName] : this.eventMap[eventName]
    if (eventCallbacks && eventCallbacks.length) {
      eventCallbacks.forEach((eventCallback) => eventCallback(eventData))
    }
    
    return this
  }

  public on(eventName: string, callback: IAnyFunction, useCapture?: boolean): CanvasqEventEmitter {
    const eventMap = useCapture ? this.captureEventMap : this.eventMap

    eventMap[eventName] = eventMap[eventName] || []
    if (eventMap[eventName].indexOf(callback) === -1) {
      eventMap[eventName].push(callback)
    }

    this.canvasqContext.subscribe(eventName)

    return this
  }
}

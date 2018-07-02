import { applyMixins } from '../utils/objectUtil'
import CanvasqEventEmitter from './canvasqEventEmitter'
import {
  IAnyFunction,
  ICanvasqContext,
  ICanvasqElement,
  ICanvasqElementOptions,
} from './types'

class CanvasqElement implements ICanvasqElement {

  public canvasqContext: ICanvasqContext
  /**
   * eventMap stores event callbacks for given event in buble phase
   */
  public eventMap: {[key: string]: IAnyFunction[]} = {}
  /**
   * captureEventMap stores event callbacks for given event in capture phase
   */
  public captureEventMap: {[key: string]: IAnyFunction[]} = {}
  public key: string
  private states: object
  private attributes: object

  constructor(key: string, options: ICanvasqElementOptions) {
    this.key = key
    this.states = options.states || {}
    this.attributes = options.attributes || {}
    this.canvasqContext = options.canvasqContext
  }

  public fire(eventName: string, eventData?: any, isCapturePhase?: boolean): ICanvasqElement { return this }
  public on(eventName: string, callback: IAnyFunction, useCapture?: boolean): ICanvasqElement { return this }

  public addToCollection(collectionName: string): ICanvasqElement {
    this.canvasqContext.addToCollection(collectionName, this)
    return this
  }
}
applyMixins(CanvasqElement, [CanvasqEventEmitter])
export default CanvasqElement

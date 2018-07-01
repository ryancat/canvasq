import { applyMixins } from '../utils/objectUtil'
import CanvasqElement from './CanvasqElement'
import CanvasqEventEmitter from './CanvasqEventEmitter'
import {
  IAnyFunction,
  ICanvasqContext,
  ICanvasqElementCollection,
  ICanvasqElementCollectionOptions,
} from './types'

class CanvasqElementCollection extends Array<CanvasqElement> implements ICanvasqElementCollection {

  public canvasqContext: ICanvasqContext
  /**
   * eventMap stores event callbacks for given event in buble phase
   */
  public eventMap: {[key: string]: IAnyFunction[]} = {}
  /**
   * captureEventMap stores event callbacks for given event in capture phase
   */
  public captureEventMap: {[key: string]: IAnyFunction[]} = {}
  public cqCollectionMap: {[key: string]: CanvasqElementCollection} = {}
  public cqElementMap: {[key: string]: CanvasqElement} = {}

  constructor(options: ICanvasqElementCollectionOptions) {
    super()
    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, CanvasqElementCollection.prototype)
    } else {
      // For IE 10 and below, manually copy over the prototype functions
      this.push = Array.prototype.push
      this.shift = Array.prototype.shift
    }

    this.canvasqContext = options.canvasqContext
  }

  public fire(eventName: string, eventData?: any, isCapturePhase?: boolean): CanvasqElementCollection { return this }
  public on(eventName: string, callback: IAnyFunction, useCapture?: boolean): CanvasqElementCollection { return this }

  public isEmpty(): boolean {
    return this.length === 0
  }

  public add(canvasqElement: CanvasqElement): CanvasqElementCollection {
    this.push(canvasqElement)
    this.cqElementMap[canvasqElement.key] = canvasqElement
    return this
  }

  public query(className: string): CanvasqElement | null {
    const cqCollection: CanvasqElementCollection | undefined = this.cqCollectionMap[className]
    if (!cqCollection || cqCollection.isEmpty()) {
      // No canvasq elements has such class name
      return null
    }

    return cqCollection[0]
  }

  public queryAll(className?: string): CanvasqElementCollection {
    return className ? this.cqCollectionMap[className] : this
  }
}

applyMixins(CanvasqElementCollection, [CanvasqEventEmitter])
export default CanvasqElementCollection

// Need to maintain a map of hashed(rbga value) -> element instance (one to one)
// and a map of className -> element instance (many to many)

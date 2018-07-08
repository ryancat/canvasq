import { applyMixins } from '../utils/objectUtil'
import CanvasqElement from './CanvasqElement'
import CanvasqEventEmitter from './CanvasqEventEmitter'
import {
  IAnyFunction,
  ICanvasqContext,
  ICanvasqElement,
  ICanvasqElementCollection,
  ICanvasqElementCollectionOptions,
} from './types'

class CanvasqElementCollection extends Array<ICanvasqElement> implements ICanvasqElementCollection {

  public canvasqContext: ICanvasqContext
  /**
   * eventMap stores event callbacks for given event in buble phase
   */
  public eventMap: {[key: string]: IAnyFunction[]} = {}
  /**
   * captureEventMap stores event callbacks for given event in capture phase
   */
  public captureEventMap: {[key: string]: IAnyFunction[]} = {}
  public cqCollectionMap: {[key: string]: ICanvasqElementCollection} = {}
  public cqElementMap: {[key: string]: ICanvasqElement} = {}
  private attributeMap: {[key: string]: any} = {}

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

  public fire(eventName: string, eventData?: any, isCapturePhase?: boolean): ICanvasqElementCollection { return this }
  public on(eventName: string, callback: IAnyFunction, useCapture?: boolean): ICanvasqElementCollection { return this }

  public isEmpty(): boolean {
    return this.length === 0
  }

  public add(canvasqElement: ICanvasqElement): ICanvasqElementCollection {
    this.push(canvasqElement)
    this.cqElementMap[canvasqElement.key] = canvasqElement
    return this
  }

  public query(collectionKey: string): ICanvasqElement | null {
    const cqCollection: ICanvasqElementCollection | undefined = this.cqCollectionMap[collectionKey]
    if (!cqCollection || cqCollection.isEmpty()) {
      // No canvasq elements has such class name
      return null
    }

    return cqCollection[0]
  }

  public queryAll(collectionKey?: string): ICanvasqElementCollection {
    return collectionKey ? this.cqCollectionMap[collectionKey] : this
  }

  public addToCollection(collectionKey: string, item: ICanvasqElement | ICanvasqElementCollection): ICanvasqElementCollection {
    this.cqCollectionMap[collectionKey] = this.cqCollectionMap[collectionKey] || new CanvasqElementCollection({
      canvasqContext: this.canvasqContext
    })
    
    const targetCollection = this.cqCollectionMap[collectionKey]
    if (item instanceof CanvasqElement) {
      item.addCollectionKey(collectionKey)
      targetCollection.add(item)
    } else if (item instanceof CanvasqElementCollection) {
      for (const canvasqElement of item) {
        canvasqElement.addCollectionKey(collectionKey)
        targetCollection.add(canvasqElement)
      }
    }

    return this
  }

  public setContextState(stateKey: string, stateVal: string, forceRender?: boolean): ICanvasqElementCollection {
    this.forEach((canvasqElement) => canvasqElement.setContextState(stateKey, stateVal, forceRender))
    return this
  }

  public getAttribute(attributeKey: string): string {
    return this.attributeMap[attributeKey]
  }

  public setAttribute(attributeKey: string, attributeVal: any): ICanvasqElementCollection {
    this.attributeMap[attributeKey] = attributeVal
    return this
  }
}

applyMixins(CanvasqElementCollection, [CanvasqEventEmitter])
export default CanvasqElementCollection

// Need to maintain a map of hashed(rbga value) -> element instance (one to one)
// and a map of className -> element instance (many to many)

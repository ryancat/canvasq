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
  public collectionKeys: string[] = []
  private attributes: object
  private contextState: {[key: string]: string}
  private attributeMap: {[key: string]: any} = {}

  constructor(key: string, options: ICanvasqElementOptions) {
    this.key = key
    this.contextState = options.contextState || {}
    this.attributes = options.attributes || {}
    this.canvasqContext = options.canvasqContext
  }

  public fire(eventName: string, eventData?: any, isCapturePhase?: boolean): ICanvasqElement { return this }
  public on(eventName: string, callback: IAnyFunction, useCapture?: boolean): ICanvasqElement { return this }

  public addToCollection(collectionKey: string): ICanvasqElement {
    this.canvasqContext.addToCollection(collectionKey, this)
    return this
  }

  public getContextState(stateKey: string): string {
    return this.contextState[stateKey]
  }

  public setContextState(stateKey: string, stateVal: string): ICanvasqElement {
    this.contextState[stateKey] = stateVal
    return this
  }

  public addCollectionKey(collectionKey: string): ICanvasqElement {
    if (this.collectionKeys.indexOf(collectionKey) === -1) {
      // Only add when the element doesn't have such colletion key already
      this.collectionKeys.push(collectionKey)
    }
    return this
  }

  public removeCollectionKey(collectionKey: string): ICanvasqElement {
    let indexOfGivenCollectionKey: number = this.collectionKeys.indexOf(collectionKey)
    
    while(indexOfGivenCollectionKey >= 0) {
      this.collectionKeys.splice(indexOfGivenCollectionKey, 1)
      indexOfGivenCollectionKey = this.collectionKeys.indexOf(collectionKey)
    }

    return this
  }

  // TODO: we have antialiasing issue
  public renderContextState(): ICanvasqElement {
    const hiddenContext = this.canvasqContext.hiddenContext
    const hiddenCanvas = hiddenContext.canvas
    const context: {[key: string]: any} = this.canvasqContext.context
    const width = hiddenCanvas.width
    const height = hiddenCanvas.height
    const hiddenImageData = this.canvasqContext.hiddenContext.getImageData(0, 0, width, height).data
    
    // Prepare context state
    context.save()
    // Need to reset all previous path to only overwrite gieven canvasqElement
    context.beginPath()
    for (const stateKey in this.contextState) {
      context[stateKey] = this.contextState[stateKey]
    }

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const startIndex = row * width * 4 + col * 4
        const [r, g, b] = hiddenImageData.slice(startIndex, startIndex + 4)
        if (this.key === `${r}-${g}-${b}`) {
          // Find the pixel position for this instance
          context.rect(col, row, 1, 1)
        }
      }
    }
    context.fill()
    context.restore()
    return this
  }
}
applyMixins(CanvasqElement, [CanvasqEventEmitter])
export default CanvasqElement

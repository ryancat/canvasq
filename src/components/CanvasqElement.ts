import CanvasqEvent from './CanvasqEvent'
import CanvasqEventEmitter from './canvsqEventEmitter'
import {
  IAnyFunction,
  IAnyObject,
  ICanvasqElement,
} from './types'

export default class CanvasqElement extends CanvasqEventEmitter implements ICanvasqElement {

  public eventMap: {[key: string]: IAnyFunction[]}
  private key: string

  constructor(key: string, states?: object, attributes?: object) {
    super()
    this.key = key
    this.eventMap = {}
  }
}

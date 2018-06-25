import CanvasqElement from './CanvasqElement'
import CanvasqElementCollection from './CanvasqElementCollection'
import CanvasqEvent from './CanvasqEvent'
import {IAnyFunction} from '../interfaces/common'

// interface CanvasRenderingContext2D {
//   [key: string]: any
// }

// interface CanvasqContext {
//   [key: string]: any
// }

// Interfaces
interface ICanvasqContext {
  query: (className: string) => CanvasqElement | null,
  // queryAll: (className: string | undefined) => CanvasqElementCollection
}



enum CanvasqContextEvent {
  ContextDrawn,
  ContextUpdate,
}

/**
 * The CanvasqContext is a wrapper on top of CanvasRenderingContext2D
 */
export default class CanvasqContext implements ICanvasqContext {
  /**
   * The original canvas context with hooks to canvasqContext
   */
  public context: CanvasRenderingContext2D
  /**
   * A hidden canvas that renders different colors for different
   * elements drawn on the main canvas
   */
  private canvas: HTMLCanvasElement
  private rootCanvasqElementCollection: CanvasqElementCollection
  private eventMap: {[key: string]: IAnyFunction[]}

  constructor(canvas: HTMLCanvasElement) {
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (!context) {
      throw new Error('canvas has no CanvasRenderingContext2D context')
    }

    this.context = context
    this.canvas = document.createElement('canvas')
    this.rootCanvasqElementCollection = new CanvasqElementCollection()
    this.eventMap = {}

    this.addHooksToContext()
    // this.initDelegateCanvas(canvas)
    this.initHiddenCanvas()
    this.listen()
  }

  public query(className: string): CanvasqElement | null {
    return this.rootCanvasqElementCollection.query(className)
  }

  private listen() {
    this.on(CanvasqContextEvent.ContextDrawn, this.handleContextDrawn.bind(this))
  }

  private fire(eventName: CanvasqContextEvent, eventData?: any) {
    const eventCallbacks: IAnyFunction[] = this.eventMap[eventName]
    if (eventCallbacks && eventCallbacks.length) {
      eventCallbacks.forEach((eventCallback) => eventCallback(eventData))
    }
  }

  private on(eventName: CanvasqContextEvent, callback: IAnyFunction) {
    this.eventMap[eventName] = this.eventMap[eventName] || []
    if (this.eventMap[eventName].indexOf(callback) === -1) {
      this.eventMap[eventName].push(callback)
    }
  }

  private handleContextDrawn() {
    console.log('something drawn')
  }

  private addMonitorWrap(functionToMonitor: IAnyFunction,
    eventName: CanvasqContextEvent,
    context: object): IAnyFunction {
    const that = this
    context = context || null

    return function() {
      that.fire(eventName)
      return functionToMonitor.apply(context, arguments)
    }
  }

  /**
   * Add hooks to context we are monitoring
   * When the context draw something, we need to capture that and store
   * all necessary information in canvasqContext
   */
  private addHooksToContext(): CanvasqContext {
    this.context.fill = this.addMonitorWrap(this.context.fill, CanvasqContextEvent.ContextDrawn, this.context)
    this.context.fillRect = this.addMonitorWrap(this.context.fillRect, CanvasqContextEvent.ContextDrawn, this.context)
    this.context.fillText = this.addMonitorWrap(this.context.fillText, CanvasqContextEvent.ContextDrawn, this.context)
    this.context.stroke = this.addMonitorWrap(this.context.stroke, CanvasqContextEvent.ContextDrawn, this.context)
    this.context.strokeRect = this.addMonitorWrap(
      this.context.strokeRect, CanvasqContextEvent.ContextDrawn, this.context)
    this.context.strokeText = this.addMonitorWrap(
      this.context.strokeText, CanvasqContextEvent.ContextDrawn, this.context)

    return this
  }

  private initHiddenCanvas(): CanvasqContext {
    this.canvas.width = this.context.canvas.width
    this.canvas.height = this.context.canvas.height
    return this
  }
}

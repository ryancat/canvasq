import { IAnyFunction, IAnyObject } from '../interfaces/common'
import CanvasqElement from './CanvasqElement'
import CanvasqElementCollection from './CanvasqElementCollection'
import CanvasqEvent from './CanvasqEvent'

// Interfaces
interface ICanvasqContext {
  query: (className: string) => CanvasqElement | null,
  // queryAll: (className: string | undefined) => CanvasqElementCollection
}

interface ICanvasqContextEventData {
  propKey: string,
  propVal: any[]
}

enum CanvasqContextEvent {
  ContextDrawn,
  ContextPathUpdate,
}

const isDebugMode = true

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
  private hiddenCanvas: HTMLCanvasElement
  private rootCanvasqElementCollection: CanvasqElementCollection
  private eventMap: {[key: string]: IAnyFunction[]}

  constructor(canvas: HTMLCanvasElement) {
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (!context) {
      throw new Error('canvas has no CanvasRenderingContext2D context')
    }

    this.context = context
    this.hiddenCanvas = document.createElement('canvas')
    this.rootCanvasqElementCollection = new CanvasqElementCollection()
    this.eventMap = {}

    this.initHooks()
    // this.initDelegateCanvas(canvas)
    this.initHiddenCanvas()

    if (isDebugMode) {
      document.body.appendChild(this.hiddenCanvas)
    }

    this.listen()
  }

  public query(className: string): CanvasqElement | null {
    return this.rootCanvasqElementCollection.query(className)
  }

  private listen() {
    this.on(CanvasqContextEvent.ContextDrawn, this.handleContextDrawn.bind(this))
    this.on(CanvasqContextEvent.ContextPathUpdate, this.handleContextPathUpdate.bind(this))
  }

  private fire(eventName: CanvasqContextEvent, eventData?: ICanvasqContextEventData) {
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

  private executeOnContext(methodName: string, mathodArgs: any[]) {
    // Need to update path on the hidden canvas as well
    const context: IAnyObject | null = this.hiddenCanvas.getContext('2d')
    if (!context || !context[methodName] || typeof context[methodName] !== 'function') {
      throw new Error(`hidden context has no path methods: ${methodName}`)
    }

    // TODO: set stroke and fill style based on hash value
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    context.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
    context.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`
    return context[methodName].apply(context, mathodArgs)
  }

  private handleContextDrawn(data: ICanvasqContextEventData) {
    console.log(this.context, data)
    this.executeOnContext(data.propKey, data.propVal)
  }

  private handleContextPathUpdate(data: ICanvasqContextEventData) {
    console.log(this.context, data)
    this.executeOnContext(data.propKey, data.propVal)
  }

  private addMonitorWrapToFunction(
    propKey: string,
    eventName: CanvasqContextEvent,
    context: IAnyObject): CanvasqContext {
    const that = this
    const functionToMonitor = context[propKey]

    if (typeof functionToMonitor !== 'function') {
      throw new Error('cannot monitor non-function item')
    }

    context[propKey] = function() {
      that.fire(eventName, { propKey, propVal: Array.prototype.slice.call(arguments) })
      return functionToMonitor.apply(context, arguments)
    }

    return this
  }

  // private addMonitorWrapToProperty(
  //   propKey: string,
  //   eventName: CanvasqContextEvent,
  //   context: IAnyObject): CanvasqContext {
  //   const that = this
  //   let propValue = context[propKey]

  //   if (!propValue) {
  //     // No such property
  //     throw new Error('no such property to monitor')
  //   }

  //   Object.defineProperty(context, propKey, {
  //     get() {
  //       return propValue
  //     },

  //     set(value) {
  //       that.fire(CanvasqContextEvent.ContextUpdate, {propKey, value})
  //       propValue = value
  //     },
  //   })

  //   return this
  // }

  // private addMonitorWrap(
  //   propKey: string,
  //   eventName: CanvasqContextEvent,
  //   context: IAnyObject): CanvasqContext {
  //   if (typeof context[propKey] === 'function') {
  //     return this.addMonitorWrapToFunction(propKey, eventName, context)
  //   } else {
  //     return this.addMonitorWrapToProperty(propKey, eventName, context)
  //   }
  // }

  /**
   * Add hooks to context we are monitoring
   * When the context draw something, we need to capture that and store
   * all necessary information in canvasqContext
   */
  private initHooks(): CanvasqContext {
    this.addHooksToFunctions([
      'fill',
      'fillRect',
      'fillText',
      'stroke',
      'strokeRect',
      'strokeText',
      'clearRect',
      'drawImage',
      'putImageData',
    ], CanvasqContextEvent.ContextDrawn)

    this.addHooksToFunctions([
      'beginPath',
      'closePath',
      'clip',
      'moveTo',
      'lineTo',
      'quadraticCurveTo',
      'bezierCurveTo',
      'arcTo',
      'rect',
      'arc',
    ], CanvasqContextEvent.ContextPathUpdate)

    return this
  }

  private addHooksToFunctions(functionKeys: string[], eventName: CanvasqContextEvent): CanvasqContext {
    for (const key of functionKeys) {
      this.addMonitorWrapToFunction(key, eventName, this.context)
    }
    return this
  }

  // private addHooksToStateAttributes(): CanvasqContext {
  //   for (const key in this.context) {
  //     // TODO: the key are not the own properties for this.context
  //     if (Object.prototype.hasOwnProperty.call(this.context, key)) {
  //       const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(this.context, key)
  //       if (!descriptor || !descriptor.writable) {
  //         continue
  //       }

  //       // Only monitor the state if it's writable
  //       this.addMonitorWrap(key, CanvasqContextEvent.ContextDrawn, this.context)
  //     }
  //   }

  //   return this
  // }

  private initHiddenCanvas(): CanvasqContext {
    this.hiddenCanvas.width = this.context.canvas.width
    this.hiddenCanvas.height = this.context.canvas.height
    return this
  }
}

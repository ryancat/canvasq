import CanvasqElement from './CanvasqElement'
import CanvasqElementCollection from './CanvasqElementCollection'
import {
  CanvasqContextHookType,
  IAnyObject,
  ICanvasqContext,
  ICanvasqContextEventData,
  ICanvasqElement,
  ICanvasqElementCollection,
  ICanvasqListeningEvent,
  IRgb,
} from './types'

const isDebugMode = true
const listOfDrawFunctions = [
  'fill',
  'fillRect',
  'fillText',
  'stroke',
  'strokeRect',
  'strokeText',
  'clearRect',
  'drawImage',
  'putImageData',
]

const listOfPathUpdateFunctions = [
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
]

/**
 * The CanvasqContext is a wrapper on top of CanvasRenderingContext2D
 */
export default class CanvasqContext implements ICanvasqContext {
  /**
   * Convert a canvasq element key to rgb values
   * @param key the canvasqElementKey
   * @return rgb values map
   */
  public static convertElementKeyToRgb(key: string): IRgb {
    return key.split('-').map((val: string): number => {
      return parseInt(val, 10)
    })
  }

  /**
   * The original canvas context with hooks to canvasqContext
   */
  public context: CanvasRenderingContext2D
  /**
   * A hidden canvas that renders different colors for different
   * elements drawn on the main canvas
   */
  private hiddenCanvas: HTMLCanvasElement
  private hiddenContext: CanvasRenderingContext2D
  private rootCanvasqElementCollection: ICanvasqElementCollection
  private canvasqElementCount: number
  private isElementQueueDirty: boolean
  private cachedBfsQueue: Array<ICanvasqElement | ICanvasqElementCollection>
  private listeningEvents: ICanvasqListeningEvent[]

  constructor(canvas: HTMLCanvasElement) {
    this.hiddenCanvas = document.createElement('canvas')

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    const hiddenContext: CanvasRenderingContext2D | null = this.hiddenCanvas.getContext('2d')
    if (!context || !hiddenContext) {
      throw new Error('canvas has no CanvasRenderingContext2D context')
    }

    this.context = context
    this.hiddenContext = hiddenContext
    this.rootCanvasqElementCollection = new CanvasqElementCollection({
      canvasqContext: this,
    })
    this.canvasqElementCount = 0
    this.isElementQueueDirty = false
    this.cachedBfsQueue = []
    this.listeningEvents = []

    this.initHooks()
    // this.initDelegateCanvas(canvas)
    this.initHiddenCanvas()

    if (isDebugMode) {
      document.body.appendChild(this.hiddenCanvas)
    }
  }

  public query(className: string): ICanvasqElement | null {
    return this.rootCanvasqElementCollection.query(className)
  }

  public queryAll(className?: string): ICanvasqElementCollection {
    return this.rootCanvasqElementCollection.queryAll(className)
  }

  public destroy(): void {
    this.removeHooksFromFunctions(listOfDrawFunctions)
    this.removeHooksFromFunctions(listOfPathUpdateFunctions)

    for (const listeningEvent of this.listeningEvents) {
      this.context.canvas.removeEventListener(listeningEvent.eventName, listeningEvent.callback)
    }
  }

  public subscribe(eventName: string): void {
    if (this.listeningEvents.find((listeningEvent) => listeningEvent.eventName === eventName)) {
      return
    }

    const that = this
    function handleMouseEvent(evt: Event) {
      // Only support mouse event now
      if (evt instanceof MouseEvent) {
        const x = evt.clientX - that.context.canvas.getBoundingClientRect().left
        const y = evt.clientY - that.context.canvas.getBoundingClientRect().top
        const [red, green, blue] = that.hiddenContext.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
        const canvasqElementKey = `${red}-${green}-${blue}`
        const focusedQueue: Array<ICanvasqElement | ICanvasqElementCollection> = that.getBfsTraverseQueue().filter((item) => {
          let willFire = false
          if (item instanceof CanvasqElement) {
            willFire = item.key === canvasqElementKey
          } else if (item instanceof CanvasqElementCollection) {
            willFire = !!item.cqElementMap[canvasqElementKey]
          }

          return willFire
        })

        // Capture phase
        focusedQueue.forEach((item) => item.fire(eventName, evt, true))

        // Bubble phase
        focusedQueue.reverse().forEach((item) => item.fire(eventName, evt))
      }
    }

    this.context.canvas.addEventListener(eventName, handleMouseEvent)

    this.listeningEvents.push({
      callback: handleMouseEvent,
      eventName,
    })
  }

  public addToCollection(collectionName: string, item: ICanvasqElement | ICanvasqElementCollection): ICanvasqContext {
    this.rootCanvasqElementCollection.addToCollection(collectionName, item)
    return this
  }

  private getBfsTraverseQueue(): Array<ICanvasqElement | ICanvasqElementCollection> {
    if (!this.isElementQueueDirty) {
      return this.cachedBfsQueue
    }

    const bfsQueue: Array<ICanvasqElement | ICanvasqElementCollection> = [this.rootCanvasqElementCollection]
    let iterIndex = 0

    while (iterIndex < bfsQueue.length) {
      const item = bfsQueue[iterIndex]
      iterIndex++

      if (!item) {
        continue
      }

      // Make sure the item moved to the end of queue, so that the capture and bubble phase fire order is correct
      if (item instanceof CanvasqElementCollection) {
        for (const collectionKey in item.cqCollectionMap) {
          if (item.cqCollectionMap.hasOwnProperty(collectionKey)) {
            const childCollection: ICanvasqElementCollection = item.cqCollectionMap[collectionKey]
            const possibleIndex: number = bfsQueue.indexOf(childCollection)
            if (possibleIndex >= 0) {
              bfsQueue.splice(possibleIndex, 1)
              if (possibleIndex <= iterIndex) {
                iterIndex--
              }
            }
            bfsQueue.push(childCollection)
          }
        }

        for (const cqElement of item) {
          const possibleIndex: number = bfsQueue.indexOf(cqElement)
            if (possibleIndex >= 0) {
              bfsQueue.splice(possibleIndex, 1)
              if (possibleIndex <= iterIndex) {
                iterIndex--
              }
            }
            bfsQueue.push(cqElement)
        }
      }
    }

    this.cachedBfsQueue = bfsQueue
    this.isElementQueueDirty = false
    return bfsQueue
  }

  // public fire(eventName: CanvasqEventType, eventData?: ICanvasqContextEventData): CanvasqContext {
  //   const eventCallbacks: IAnyFunction[] = this.eventMap[eventName]
  //   if (eventCallbacks && eventCallbacks.length) {
  //     eventCallbacks.forEach((eventCallback) => eventCallback(eventData))
  //   }

  //   return this
  // }

  // public on(eventName: CanvasqEventType, callback: IAnyFunction): CanvasqContext {
  //   this.eventMap[eventName] = this.eventMap[eventName] || []
  //   if (this.eventMap[eventName].indexOf(callback) === -1) {
  //     this.eventMap[eventName].push(callback)
  //   }

  //   return this
  // }

  private getNextElementKey(): string {
    const highMultiply = 255 * 255
    const lowMultiply = 255
    const count: number = ++this.canvasqElementCount
    const r = Math.floor(count / highMultiply)
    const g = Math.floor((count - r * highMultiply) / lowMultiply)
    const b = (count - r * highMultiply - g * lowMultiply)

    return `${r}-${g}-${b}`
  }

  private executeOnHiddenContext(methodName: string, mathodArgs: any[], contextState?: object) {
    // Need to update path on the hidden canvas as well
    const context: IAnyObject = this.hiddenContext
    if (!context || !context[methodName] || typeof context[methodName] !== 'function') {
      throw new Error(`hidden context has no path methods: ${methodName}`)
    }

    this.copyContextState(contextState)
    return context[methodName].apply(context, mathodArgs)
  }

  private handleContextDraw(data: ICanvasqContextEventData) {
    // We need to draw with current context state
    this.copyContextState()

    const methodName = data.propKey
    const args = data.propVal

    // Create canvasq element when draw something
    // TODO: create canvasq element only when it's necessary
    // Should allow consumer to manually define grouping
    const elementKey = this.getNextElementKey()
    const rgb = CanvasqContext.convertElementKeyToRgb(elementKey)
    this.rootCanvasqElementCollection.add(new CanvasqElement(elementKey, {
      canvasqContext: this,
    }))

    this.executeOnHiddenContext(methodName, args, {
      fillStyle: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
      strokeStyle: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
    })

    this.isElementQueueDirty = true
  }

  private handleContextPathUpdate(data: ICanvasqContextEventData) {
    const methodName = data.propKey
    const args = data.propVal
    this.executeOnHiddenContext(methodName, args)
  }

  private copyContextState(contextState?: IAnyObject): ICanvasqContext {
    contextState = contextState || this.context
    const hiddenContext: IAnyObject = this.hiddenContext
    for (const key in contextState) {
      if ((contextState.hasOwnProperty(key) || contextState.__proto__.hasOwnProperty(key)) &&
      typeof contextState[key] !== 'function') {
        const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(hiddenContext.__proto__, key)
        if (!descriptor || !descriptor.set) {
          continue
        }

        // Only monitor the state if it's writable
        hiddenContext[key] = contextState[key]
      }
    }

    return this
  }

  private addMonitorWrapToFunction(
    propKey: string,
    context: IAnyObject,
    hookType: CanvasqContextHookType): ICanvasqContext {
    const that = this
    const functionToMonitor = context[propKey]

    if (typeof functionToMonitor !== 'function') {
      throw new Error('cannot monitor non-function item')
    }

    context[propKey] = function() {
      switch (hookType) {
        case CanvasqContextHookType.ContextDrawn:
          that.handleContextDraw({
            propKey,
            propVal: Array.prototype.slice.call(arguments),
          })
          break

        case CanvasqContextHookType.ContextPathUpdate:
          that.handleContextPathUpdate({
            propKey,
            propVal: Array.prototype.slice.call(arguments),
          })
          break

        default:
          throw new Error(`canvasq context hook type is invalid: ${hookType}`)
      }

      return functionToMonitor.apply(context, arguments)
    }

    return this
  }

  private removeMonitorWrapFromFunction(
    propKey: string,
    context: IAnyObject): ICanvasqContext {
    delete context[propKey]
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
  //       that.fire(CanvasqEventType.ContextUpdate, {propKey, value})
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
  private initHooks(): ICanvasqContext {
    this.addHooksToFunctions(listOfDrawFunctions, CanvasqContextHookType.ContextDrawn)
    this.addHooksToFunctions(listOfPathUpdateFunctions, CanvasqContextHookType.ContextPathUpdate)
    return this
  }

  private addHooksToFunctions(functionKeys: string[], hookType: CanvasqContextHookType): ICanvasqContext {
    for (const key of functionKeys) {
      this.addMonitorWrapToFunction(key, this.context, hookType)
    }
    return this
  }

  private removeHooksFromFunctions(functionKeys: string[]): ICanvasqContext {
    for (const key of functionKeys) {
      this.removeMonitorWrapFromFunction(key, this.context)
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
  //       this.addMonitorWrap(key, CanvasqEventType.ContextDrawn, this.context)
  //     }
  //   }

  //   return this
  // }

  private initHiddenCanvas(): ICanvasqContext {
    this.hiddenCanvas.width = this.context.canvas.width
    this.hiddenCanvas.height = this.context.canvas.height
    return this
  }
}

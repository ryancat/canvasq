import CanvasqElement from './components/CanvasqElement'
import CanvasqElementCollection from './components/CanvasqElementCollection'
import CanvasqEvent from './components/CanvasqEvent'
import {mixin} from './utils/objectUtil'

declare let window: Window

// Add index signature
interface CanvasRenderingContext2D {
  [key: string]: any
}

interface CanvasqContext {
  [key: string]: any
}

// Interfaces
interface ICanvasqContext {
  query: (className: string) => CanvasqElement | null,
  // queryAll: (className: string | undefined) => CanvasqElementCollection
}

/**
 * The CanvasqContext is 
 */
class CanvasqContext implements ICanvasqContext {
  /**
   * A hidden canvas that renders different colors for different
   * elements drawn on the main canvas
   */
  private hiddenCanvas: HTMLCanvasElement
  private rootCanvasqElementCollection: CanvasqElementCollection
  private forContext: CanvasRenderingContext2D | null

  constructor(canvas: HTMLCanvasElement) {
    // this.canvas = canvas
    this.hiddenCanvas = document.createElement('canvas')
    this.rootCanvasqElementCollection = new CanvasqElementCollection()
    this.forContext = canvas.getContext('2d')

    // Create delegate canvas
    this.initDelegateCanvas(canvas)
    this.initHiddenCanvas()
  }

  public query(className: string): CanvasqElement | null {
    return this.rootCanvasqElementCollection.query(className)
  }

  private initDelegateCanvas(canvas: HTMLCanvasElement): CanvasqContext {
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (!context) {
      // No context found for given canvas element.
      throw new Error('Canvas element provided is invalid. No CanvasRenderingContext2D found')
    }

    for (const key in context) {
      this[key] = context[key]
      
      // Make sure those API are called from context
      if (typeof this[key] === 'function') {
        this[key] = this[key].bind(context)
      }
    }

    return this
  }

  private initHiddenCanvas(): CanvasqContext {
    this.hiddenCanvas.width = this.canvas.width
    this.hiddenCanvas.height = this.canvas.height
    return this
  }
}

export default function canvasq(canvas: HTMLCanvasElement): CanvasqContext {
  return new CanvasqContext(canvas)
}

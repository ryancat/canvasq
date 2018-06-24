interface CanvasqElementInterface {

}

interface CanvasqElementCollectionInterface {

}

interface CanvasqEventInterface extends Event {

}

interface CanvasqContextInterface {
  // query: (className: string | void) => CanvasqElement,
  // queryAll: (className: string | void) => CanvasqElementCollection,
  // getState: (stateKey: string) => any,
  // setState: (stateKey: string, stateValue: any) => CanvasqContext,
  // getAttribute: (attributeKey: string) => any,
  // setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  // addClassName: (...classNames: string[]) => CanvasqContext,
  // removeClassName: (...classNames: string[]) => CanvasqContext,
  // addEventListener: (eventName: string, callback: (evt: CanvasqEventInterface) => void, useCapture: boolean) => CanvasqContext,
  // trigger: (eventName: string) => CanvasqContext
}

class CanvasqContext extends CanvasRenderingContext2D implements CanvasqContextInterface {
  /**
   * The canvas we are working with
   */
  public canvas: HTMLCanvasElement
  
  /**
   * A hidden canvas that renders different colors for different
   * elements drawn on the main canvas
   */
  private hiddenCanvas: HTMLCanvasElement

  private initHiddenCanvas (): CanvasqContext {
    this.hiddenCanvas.width = this.canvas.width
    this.hiddenCanvas.height = this.canvas.height
    return this
  }

  constructor (canvas: HTMLCanvasElement) {
    super()

    this.canvas = canvas
    this.hiddenCanvas = document.createElement('canvas')
    this.initHiddenCanvas()
  }
}

function canvasq(canvas: HTMLCanvasElement): CanvasqContext {
  return new CanvasqContext(canvas)
}
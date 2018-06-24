interface ICanvasqElement {
  
}

interface ICanvasqElementCollection {

}

interface ICanvasqEventInterface extends Event {

}

interface ICanvasqContext {
  query: (className: string | void) => CanvasqElement,
  queryAll: (className: string | void) => CanvasqElementCollection,
  getState: (stateKey: string) => any,
  setState: (stateKey: string, stateValue: any) => CanvasqContext,
  getAttribute: (attributeKey: string) => any,
  setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  addClassName: (...classNames: string[]) => CanvasqContext,
  removeClassName: (...classNames: string[]) => CanvasqContext,
  addEventListener: (eventName: string,
                      callback: (evt: CanvasqEventInterface) => void,
                      useCapture: boolean) => CanvasqContext,
  trigger: (eventName: string) => CanvasqContext
}

class CanvasqContext extends CanvasRenderingContext2D implements ICanvasqContext {
  /**
   * The canvas we are working with
   */
  public canvas: HTMLCanvasElement

  /**
   * A hidden canvas that renders different colors for different
   * elements drawn on the main canvas
   */
  private hiddenCanvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    super()

    this.canvas = canvas
    this.hiddenCanvas = document.createElement('canvas')
    this.initHiddenCanvas()
  }

  private initHiddenCanvas(): CanvasqContext {
    this.hiddenCanvas.width = this.canvas.width
    this.hiddenCanvas.height = this.canvas.height
    return this
  }
}

function canvasq(canvas: HTMLCanvasElement): ICanvasqContext {
  return new CanvasqContext(canvas)
}

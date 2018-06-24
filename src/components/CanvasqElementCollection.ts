import CanvasqElement from './CanvasqElement'

interface ICanvasqElementCollection {
  isEmpty: () => boolean,
  query: (className: string) => CanvasqElement | null,
  // queryAll: (className: string | void) => CanvasqElementCollection,
  // getState: (stateKey: string) => any,
  // setState: (stateKey: string, stateValue: any) => CanvasqContext,
  // getAttribute: (attributeKey: string) => any,
  // setAttribute: (attributeKey: string, attributeValue: any) => CanvasqContext,
  // addClassName: (...classNames: string[]) => CanvasqContext,
  // removeClassName: (...classNames: string[]) => CanvasqContext,
  // addEventListener: (
  //   eventName: string,
  //   callback: (evt: CanvasqEventInterface) => void,
  //   useCapture: boolean) => CanvasqContext
}

interface ICanvasqElementCollectionMap {
  [s: string]: CanvasqElementCollection
}

export default class CanvasqElementCollection extends Array implements ICanvasqElementCollection {

  private cqCollectionMap: ICanvasqElementCollectionMap

  constructor() {
    super()
    this.cqCollectionMap = {}
  }

  public query(className: string): CanvasqElement | null {
    const cqCollection: CanvasqElementCollection | undefined = this.cqCollectionMap[className]
    if (!cqCollection || cqCollection.isEmpty()) {
      // No canvasq elements has such class name
      return null
    }

    return cqCollection[0]
  }

  public isEmpty(): boolean {
    return this.length === 0
  }
}


// Need to maintain a map of hashed(rbga value) -> element instance (one to one)
// and a map of className -> element instance (many to many)

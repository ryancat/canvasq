import CanvasqElement from './CanvasqElement'
import {
  ICanvasqElementCollection,
} from './types'


export default class CanvasqElementCollection extends Array implements ICanvasqElementCollection {

  private cqCollectionMap: {[key: string]: CanvasqElementCollection}

  constructor() {
    super()
    this.cqCollectionMap = {}
  }

  public isEmpty(): boolean {
    return this.length === 0
  }

  public query(className: string): CanvasqElement | null {
    const cqCollection: CanvasqElementCollection | undefined = this.cqCollectionMap[className]
    if (!cqCollection || cqCollection.isEmpty()) {
      // No canvasq elements has such class name
      return null
    }

    return cqCollection[0]
  }

  public queryAll(className?: string): CanvasqElementCollection {
    return className ? this.cqCollectionMap[className] : this
  }
}


// Need to maintain a map of hashed(rbga value) -> element instance (one to one)
// and a map of className -> element instance (many to many)

import CanvasqContext from './components/CanvasqContext'

interface ICanvasq {
  watch: (canvas: HTMLCanvasElement) => ICanvasq,
  stopWatch: (canvas: HTMLCanvasElement) => ICanvasq,
  focus: (canvas: HTMLCanvasElement) => CanvasqContext
}

// export function canvasq(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
//   return (new CanvasqContext(canvas)).context
// }

let watchedCanvases: HTMLCanvasElement[] = []
let canvasqContexts: CanvasqContext[] = []

const canvasq: ICanvasq = {
  watch: (canvas: HTMLCanvasElement): ICanvasq => {
    const index: number = watchedCanvases.indexOf(canvas)

    if (index === -1) {
      watchedCanvases.push(canvas)
      // New canvas that need to be watched
      canvasqContexts.push(new CanvasqContext(canvas))
    }

    return canvasq
  },

  stopWatch: (canvas: HTMLCanvasElement): ICanvasq => {
    // Remove canvas from watching
    const index: number = watchedCanvases.indexOf(canvas)

    if (index >= 0) {
      // Found canvas in watch list
      watchedCanvases.splice(index, 1)
      // New canvas that need to be watched
      const canvasqContext = canvasqContexts.splice(index, 1)[0]
      canvasqContext.destroy()
    }

    return canvasq
  },

  focus: (canvas: HTMLCanvasElement): CanvasqContext => {
    canvasq.watch(canvas)
    return canvasqContexts[watchedCanvases.indexOf(canvas)]
  }
}

export default canvasq

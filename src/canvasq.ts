import CanvasqContext from './components/CanvasqContext'

export default function canvasq(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return (new CanvasqContext(canvas)).context
}

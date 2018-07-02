let canvas = document.querySelector('.stage')
canvasq = canvasq.default
// canvasq.watch(canvas)
const canvasqContext = canvasq.focus(canvas)

let context = canvas.getContext('2d')
context.fillStyle = '#c1c1c1'
context.rect(20, 20, 100, 100)
context.fill()

context.strokeStyle = '#ff0000'
context.lineWidth = 8

context.beginPath()
context.moveTo(20, 20)
context.lineTo(120, 120)
context.moveTo(120, 20)
context.lineTo(20, 120)
context.stroke()

// canvasqContext.collectionStart('collection 1')
let count = 0
while (count < 10) {
  let x = Math.random() * 480
  let y = Math.random() * 480
  context.moveTo(x, y)
  context.arc(x, y, 20, 0, 2 * Math.PI)
  count++
}
context.fill()
// canvasqContext.endRecord()

canvasqContext.queryAll()[0]
.addToCollection('collection 1')
.on('click', (evt) => {
  console.log('first element clicked')
})

canvasqContext.queryAll()[1]
.addToCollection('collection 1')
.addToCollection('collection 2')

canvasqContext.queryAll()[2]
.addToCollection('collection 3')
.addToCollection('collection 2')

canvasqContext.queryAll('collection 1')
.on('click', (evt) => {
  console.log('collection 1 clicked!')
})

canvasqContext.queryAll('collection 2')
.on('click', (evt) => {
  console.log('collection 2 clicked!')
})

canvasqContext.queryAll('collection 3')
.on('click', (evt) => {
  console.log('collection 3 clicked!')
})

// canvasqContext.queryAll()
// .on('click', (evt) => {
//   console.log('collection clicked')
// })
// var ctx = canvas.getContext('2d');

// // Create clipping region
// ctx.beginPath();
// ctx.arc(100, 100, 75, 0, Math.PI * 2, false);
// ctx.clip();

// console.log(ctx.isPointInPath(0, 0))

// ctx.fillRect(0, 0, 100,100);
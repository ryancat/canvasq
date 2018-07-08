let canvas = document.querySelector('.stage')
canvasq = canvasq.default
// canvasq.watch(canvas)
const canvasqContext = canvasq.focus(canvas)

let context = canvas.getContext('2d')
context.beginPath()
context.fillStyle = '#c1c1c1'
context.rect(20, 20, 100, 100)
context.fill()

canvasqContext.startCollect('collection 3')
let count = 0
context.beginPath()
while (count < 1) {
  let x = Math.random() * 480
  let y = Math.random() * 480
  context.moveTo(x, y)
  context.arc(x, y, 20, 0, 2 * Math.PI)
  count++
}
context.fill()
canvasqContext.stopCollect()

// context.strokeStyle = '#ff0000'
// context.lineWidth = 8

// context.beginPath()
// context.moveTo(20, 20)
// context.lineTo(120, 120)
// context.moveTo(120, 20)
// context.lineTo(20, 120)
// context.stroke()

// canvasqContext.queryAll()[0]
// .addToCollection('collection 1')
// .on('click', (evt) => {
//   console.log('first element clicked')
// })

// canvasqContext.queryAll()[2]
// .addToCollection('collection 1')
// .addToCollection('collection 2')

// // canvasqContext.queryAll()[2]
// // .addToCollection('collection 3')
// // .addToCollection('collection 2')

// canvasqContext.queryAll('collection 1')
// .on('click', (evt) => {
//   console.log('collection 1 clicked!')
// })

// canvasqContext.queryAll('collection 2')
// .on('click', (evt) => {
//   console.log('collection 2 clicked!')
// })

canvasqContext.queryAll('collection 3')
.on('click', (evt) => {
  console.log('collection 3 clicked!')
  console.log('now change collection 3')
  canvasqContext.queryAll('collection 3')[0]
  .setContextState('fillStyle', 'green')
  .setContextState('globalAlpha', 0.5)
  .renderContextState()
})

canvasqContext.startCollect(['collection 4', 'collection 5'])
count = 0

context.save()
context.fillStyle = 'red'
context.beginPath()
while (count < 1) {
  let x = Math.random() * 480
  let y = Math.random() * 480
  context.moveTo(x, y)
  context.rect(x, y, 20, 20)
  count++
}
context.fill()
context.restore()

// After this, collection 2 will stop collecting any new elements
canvasqContext.stopCollect('collection 4')

context.save()
// Collection 3 will continue collecting
context.fillStyle = 'blue'
context.beginPath()
while (count < 2) {
  let x = Math.random() * 480
  let y = Math.random() * 480
  context.moveTo(x, y)
  context.arc(x, y, 20, 0, 2 * Math.PI)
  count++
}
context.fill()
context.restore()

// Now collection 3 will stop collecting any new elements
canvasqContext.stopCollect()

canvasqContext.queryAll('collection 4').on('click', function (evt) {
  console.log('collection 4', evt)
})

canvasqContext.queryAll('collection 5').on('click', function (evt) {
  console.log('collection 5', evt)
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
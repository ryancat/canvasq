let canvas = document.querySelector('.stage')
// let context = canvas.getContext('2d')
canvasq = canvasq.default
let context = canvasq(canvas)

context.fillStyle = '#c1c1c1'
context.rect(20, 20, 100, 100)
context.fill()

context.strokeStyle = '#ff0000'
context.lineWidth = 2

context.beginPath()
context.moveTo(20, 20)
context.lineTo(120, 120)
context.moveTo(120, 20)
context.lineTo(20, 120)
context.stroke()



// var ctx = canvas.getContext('2d');

// // Create clipping region
// ctx.beginPath();
// ctx.arc(100, 100, 75, 0, Math.PI * 2, false);
// ctx.clip();

// console.log(ctx.isPointInPath(0, 0))

// ctx.fillRect(0, 0, 100,100);
let canvas = document.querySelector('.stage')
let context = canvas.getContext('2d')


context.fillStyle = '#c1c1c1'
console.log(context.fillRect(20, 20, 100, 100))

context.strokeStyle = '#b1b1b1'
context.lineWidth = 2

console.log(context.beginPath())
console.log(context.moveTo(20, 20))
console.log(context.lineTo(120, 120))
console.log(context.moveTo(120, 20))
console.log(context.lineTo(20, 120))
console.log(context.stroke())
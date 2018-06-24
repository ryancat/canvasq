let canvas = document.querySelector('.stage')
let context = canvas.getContext('2d')


context.fillStyle = '#c1c1c1'
context.fillRect(20, 20, 100, 100)

context.strokeStyle = '#b1b1b1'
context.lineWidth = 2

context.beginPath()
context.moveTo(20, 20)
context.lineTo(120, 120)
context.moveTo(120, 20)
context.lineTo(20, 120)
context.stroke()
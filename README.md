## canvasq
canvasq is a library that helps make interaction with html5 canvas element easier. 

Since canvas eventually produces pixels, there is no corresponding DOM element to bind event handlers, or to simply interact with. canvasq internally uses hidden canvases to record the drawn elements location in the target canvas. it also exposes all existing canvas context APIs and a set of querying APIs to let you easily migrate existing canvas project. 

### Install
Simply run `yarn add canvasq` or `npm install canvasq` to add canvasq into your application. The library expose *umd* library type, which allow you to use it with commonjs or amd dependency management libraries, or as a standalone global variable.

### Usage
canvasq wraps the target canvas element, or its context to start with:
```javascript
let canvas = document.querySelector('.my-canvas')
let context = canvasq(canvas)
let anotherContext = canvasq(canvas.getContext('2d'))
```

You can draw anything you need just using CanvasRenderingContext2D API:
```javascript
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
```

#### QUERY API
By default, canvasq will track each fill or stroke, and create a copy of the result in the hidden canvas. Later this is being used to track the drawn elements and their attributes. In above example, two elements will be created, one rectangular with fill colors, and one cross shape path.
```javascript
context.queryAll() // return *CanvasqElementCollection*
```

A *CanvasqElementCollection* instance is a collection of *CanvasqElement* instance, which holds all canvas states saved regarding to the fill or stroke, including `strokeStyle`, `fillStyle`, `globalAlpha`, `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `lineDashOffset`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`, `globalCompositeOperation`, `font`, `textAlign`, `textBaseline`, `direction`, `imageSmoothingEnabled`. Check [the `save` API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save) for more details. It also can store your custom data by getting or setting custom attributes.
```javascript
let canvasqElement = context.queryAll()[0]
canvasqElement.getState('fillStyle') // return '#c1c1c1'
// will re-render canvas to update fill style. The render happens asynchronously
canvasqElement.setState('fillStyle', '#d6d6d6') 
// re-render canvas to update fill style synchronously
canvasqElement.setState('fillStyle', '#e7e7e7')
// set custom attribute
canvasqElement.setAttribute('myData', [1, 2, 3])
// return [1, 2, 3] by reference. You can choose to use immutable data with other immutable libraries
canvasqElement.getAttribute('myData')
```

To make element query easiser, you can also add class name to a *CanvasqElement* instance.
```javascript
// set the current canvasqElement instance class name
context.setClassName('rect')
context.query('rect') // return first element with class name 'rect'
context.queryAll('rect') // return all elements with class name 'rect' in a *CanvasqElementCollection*
```

#### EVENTS API
You can add event listeners to *CanvasqElement* just like with other DOM elements. Better than that, you can also add to the entire *CanvasqElementCollection*, which will make sure all *CanvasqElement* instances in it responds to the respectful event.
```javascript
let rectElements = context.queryAll('rect')
rectElements.addEventListener('click', (evt) => {
  // evt is a custom event object that inherits from a standard HTML DOM event
  console.log(evt.canvasqElement) // *CanvasqElement* instance that got clicked on.
  // *CanvasqElementCollection* instance that contains all *CanvasqElement* instances that occupies the location where the event happens, in the order of 'z-index'
  console.log(evt.canvasqElements) 
}, useCapture)
```

Triggering an event is also possible with *CanvasqElement*. Note that the event will be bubbling up to the top level *CanvasqElementCollection*. 
```javascript
let canvasqElement = context.queryAll()[0]
canvasqElement.trigger('click') // will trigger click event handlers from canvasqElement
```

### Useful links
- [W3C canvas 2d context](https://www.w3.org/TR/2dcontext/)
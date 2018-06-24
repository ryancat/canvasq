export function mixin(targetObj: object, ...sourceObjs: Array<object | null>): object {
  const to = Object(targetObj)

  for (let index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index]

    if (typeof nextSource !== 'undefined' && nextSource !== null) { // Skip over if undefined or null
      for (const nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey) &&
        !Object.prototype.hasOwnProperty.call(to, nextKey)) {
          to[nextKey] = nextSource[nextKey]
        }
      }
    }
  }

  return to
}

// export function augment(targetObj: object, sourceObj: object | null): void {
//   if (sourceObj === null) {
//     return
//   }

//   for (const nextKey in sourceObj) {
//     // Avoid bugs when hasOwnProperty is shadowed
//     if (Object.prototype.hasOwnProperty.call(sourceObj, nextKey) &&
//     !Object.prototype.hasOwnProperty.call(targetObj, nextKey)) {
//       targetObj[nextKey] = sourceObj[nextKey]
//     }
//   }
// }

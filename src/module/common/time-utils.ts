

export const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve)=> {
    setTimeout(resolve, ms)
  })
}


export const nexttick = (callback: () => void,ms?: number): void=> {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(()=> {
      window.setTimeout(callback, ms)
    })
  } else {
    window.setTimeout(callback, ms)
  }
}


// export const nexttick = (fn: () => void): void=>{
//   if (window.requestAnimationFrame) {
//     window.requestAnimationFrame(()=> {
//       window.setTimeout(fn, 0)
//     })
//   } else if (typeof queueMicrotask !== 'undefined') {
//     // 使用 queueMicrotask
//     return queueMicrotask(fn)
//   } else {
//     // 使用 MutationObserver
//     const observer = new MutationObserver(fn)
//     const textNode = document.createTextNode(String(Math.random()))
//     observer.observe(textNode, { characterData: true })
//     textNode.data = String(Math.random())
//   }
// }

import { FPS } from './constant'

let interval
self.onmessage = function (e) {
  if (e.data === 'start') {
    interval = setInterval(() => self.postMessage('update'), 1000 / FPS)
  } else if (e.data === 'stop') {
    clearInterval(interval)
  }
}

/**
 * @author hangli2
 * @date 2023/03/27
 * @description 事件传播类
 */

export type Listener = (...args: any[]) => void

class EventEmitter {
  private listeners: Map<string, (Listener)[]>

  constructor() {
    this.listeners = new Map()
  }

  on(event: string, listener: Listener): this {
    if (this.listeners.has(<string>event)) {
      this.listeners.get(<string>event)?.push(listener)
    } else {
      this.listeners.set(<string>event, [listener])
    }
    // this.listeners.set(event, listener)
    return this
  }
  ons(event: string, listener: Listener): this {
    const events = event.split(' ')
    for (const e of events) {
      if (this.listeners.has(<string>e)) {
        this.listeners.get(<string>e)?.push(listener)
      } else {
        this.listeners.set(<string>e, [listener])
      }
    }
    // this.listeners.set(event, listener)
    return this
  }
  // 全局唯一的
  only(event: string, listener: Listener): this {
    this.listeners.set(<string>event, [listener])
    return this
  }

  off(event: string, listener: Listener): this {
    if (this.listeners.has(<string>event)) {
      // this.listeners.delete(event)
      const ls = this.listeners.get(<string>event)

      const i = ls?.findIndex(v=>v.name === listener.name && v.toString() === listener.toString())
      if (i !== undefined && i > -1) {
        ls?.splice(i,1)
      }
    }
    return this
  }

  // 注：该方法会关闭所有事件
  offAll(event: string): this {
    if (this.listeners.has(<string>event)) {
      this.listeners.delete(event)
    }
    return this
  }

  emit(event: string,...args: any[]): this {
    try {
      // console.log('app event emit :',event,args,this.listeners)
      const eventListeners = this.listeners.get(<string>event)
      if (eventListeners && eventListeners.length > 0) {
        for (const listener of eventListeners) {
          listener(...args)
        }
      } else {
        // console.log('EventEmitter no case of :', event)
      }
    } catch (error) {
      console.error(error)
    }
    return this
  }

  listenerCount(event: string) {
    const eventListeners = this.listeners.get(<string>event)
    if (eventListeners && eventListeners.length > 0) {return eventListeners.length}
    return 0
  }
}
// class ApplicationEvent {
//   private event: any
//   init() {
//     return this.event = new EventEmitter()
//   }
// }

export default EventEmitter

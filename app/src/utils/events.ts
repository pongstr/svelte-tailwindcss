import { bubble, listen, get_current_component } from 'svelte/internal'

export function isArray(obj: unknown): boolean {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

export function getEventsAction() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const component = get_current_component()

  return (node: EventTarget) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const events = Object.keys(component.$$.callbacks)
    const listeners: Array<unknown> = [...events].map((name: string) => {
      const handler: EventListener = (event: Event) => {
        bubble(component, event)
      }
      return listen(node, name, handler)
    })

    return {
      destroy: (): void => {
        listeners.forEach(listenerItem => listenerItem)
      },
    }
  }
}

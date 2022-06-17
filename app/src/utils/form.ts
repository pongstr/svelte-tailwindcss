export function focus(input: HTMLInputElement) {
  const handleFocus = () =>
    input && typeof input.select === 'function' && input.select()

  input.addEventListener('focus', handleFocus)
  return {
    destroy() {
      input.removeEventListener('focus', handleFocus)
    },
  }
}

export function blurOnEsc(input: HTMLInputElement) {
  const handleEsc = (event: KeyboardEvent) =>
    event.key === 'Escape' &&
    input &&
    typeof input.blur === 'function' &&
    input.blur()

  input.addEventListener('keydown', handleEsc)

  return {
    destroy() {
      input.removeEventListener('keydown', handleEsc)
    },
  }
}

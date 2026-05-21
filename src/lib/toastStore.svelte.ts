type ToastItem = { id: number; message: string; type: string }

let toasts = $state<ToastItem[]>([])
let nextId = 0

export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
  const id = nextId++
  toasts.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }, 3000)
}

export function getToasts() {
  return toasts
}

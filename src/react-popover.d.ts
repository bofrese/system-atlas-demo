// React 18 types predate the native HTML popover API; the DOM handles these attributes as written.
import 'react'

declare module 'react' {
  interface HTMLAttributes<T> { popover?: '' | 'auto' | 'manual' }
  interface ButtonHTMLAttributes<T> { popoverTarget?: string }
}

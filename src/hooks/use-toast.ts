import type React from "react"

import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

type ToastState = ToastProps & {
  id: string
  open: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = useCallback(
    ({ id = crypto.randomUUID(), title, description, action, variant = "default", duration = 5000 }: ToastProps) => {
      setToasts((prevToasts) => [
        ...prevToasts,
        {
          id,
          title,
          description,
          action,
          variant,
          duration,
          open: true,
        },
      ])

      return id
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)))
  }, [])

  const update = useCallback((id: string, props: ToastProps) => {
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, ...props } : toast)))
  }, [])

  useEffect(() => {
    const timeouts = new Map<string, NodeJS.Timeout>()

    toasts.forEach((toast) => {
      if (!toast.open || !toast.duration) return

      const timeout = setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)

      timeouts.set(toast.id, timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [toasts, dismiss])

  
  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.open))
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return {
    toast,
    dismiss,
    update,
    toasts,
  }
}

export type { ToastProps }

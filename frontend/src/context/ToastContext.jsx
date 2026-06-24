import { createContext, useCallback, useContext, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ToastContext = createContext(null)

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-950",
    iconClassName: "text-emerald-600",
  },
  error: {
    icon: AlertCircle,
    className:
      "border-red-200 bg-red-50 text-red-950",
    iconClassName: "text-red-600",
  },
  warning: {
    icon: TriangleAlert,
    className:
      "border-amber-200 bg-amber-50 text-amber-950",
    iconClassName: "text-amber-600",
  },
  info: {
    icon: Info,
    className:
      "border-sky-200 bg-sky-50 text-sky-950",
    iconClassName: "text-sky-600",
  },
}

function ToastItem({ toast, onDismiss }) {
  const appearance = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  const Icon = appearance.icon

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right-4 fade-in-0",
        appearance.className
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", appearance.iconClassName)} />
      <div className="min-w-0 flex-1 space-y-1">
        {toast.title ? <p className="text-sm font-semibold">{toast.title}</p> : null}
        <p className="text-sm">{toast.message}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8 shrink-0 rounded-full text-current hover:bg-black/5"
        onClick={() => onDismiss(toast.id)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss notification</span>
      </Button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const showToast = useCallback(
    ({
      title = "",
      message,
      type = "info",
      duration = 4000,
    }) => {
      const normalizedMessage = String(message || "").trim()

      if (!normalizedMessage) {
        return ""
      }

      const toastId =
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      const nextToast = {
        id: toastId,
        title,
        message: normalizedMessage,
        type,
      }

      setToasts((current) => [...current, nextToast])

      globalThis.setTimeout(() => {
        dismissToast(toastId)
      }, duration)

      return toastId
    },
    [dismissToast]
  )

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.")
  }

  return context
}

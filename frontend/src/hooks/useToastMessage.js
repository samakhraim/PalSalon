import { useToast } from "@/context/ToastContext"
import { resolveErrorMessage } from "@/lib/notifications"

export function useToastMessage() {
  const { showToast, dismissToast } = useToast()

  return {
    dismissToast,
    showSuccess(message, title = "Success") {
      return showToast({ type: "success", title, message })
    },
    showWarning(message, title = "Warning") {
      return showToast({ type: "warning", title, message })
    },
    showInfo(message, title = "Info") {
      return showToast({ type: "info", title, message })
    },
    showError(error, fallbackMessage, title = "Error") {
      const message = resolveErrorMessage(error, fallbackMessage)
      showToast({ type: "error", title, message })
      return message
    },
  }
}

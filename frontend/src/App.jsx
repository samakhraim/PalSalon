import { AuthProvider } from "@/context/AuthContext"
import { ToastProvider } from "@/context/ToastContext"
import AppRoutes from "@/routes/AppRoutes"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App() {
  return (
    <ToastProvider>
      <TooltipProvider>
        <AuthProvider>
          <div className="theme min-h-screen bg-background text-foreground">
            <AppRoutes />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </ToastProvider>
  )
}

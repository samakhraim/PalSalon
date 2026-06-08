import AppRoutes from "@/routes/AppRoutes"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App() {
  return (
    <TooltipProvider>
      <div className="theme min-h-screen bg-background text-foreground">
        <AppRoutes />
      </div>
    </TooltipProvider>
  )
}

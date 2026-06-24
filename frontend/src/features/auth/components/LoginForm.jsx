import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { useToastMessage } from "@/hooks/useToastMessage"
import { loginRequest } from "@/features/auth/authService"
import { validateLoginInput } from "@/features/auth/authValidation"

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showError, showSuccess } = useToastMessage()
  const [email, setEmail] = useState("admin@palsalon.com")
  const [password, setPassword] = useState("password")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const redirectTo = location.state?.from?.pathname || "/dashboard"

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateLoginInput({ email, password })

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const payload = await loginRequest({
        email: email.trim(),
        password,
      })

      if (!payload.token || !payload.user) {
        throw new Error("Login response is missing user data")
      }

      login(payload)
      showSuccess("Logged in successfully.")
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const message = showError(error, "Invalid email or password")
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Sign in to access the PalSalon dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@palsalon.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <Separator />

        <div className="text-sm text-muted-foreground">
          Use the seeded admin account to enter the dashboard.
        </div>
      </CardContent>
    </Card>
  )
}

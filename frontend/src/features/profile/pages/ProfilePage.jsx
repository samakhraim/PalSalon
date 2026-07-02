import { useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, Mail, Phone, ShieldCheck, UserCircle2 } from "lucide-react"

import PageHeader from "@/components/common/PageHeader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { useToastMessage } from "@/hooks/useToastMessage"
import {
  getProfile,
  updateProfile,
  updateProfilePassword,
} from "@/features/profile/profileService"

const EMPTY_PROFILE_FORM = {
  name: "",
  email: "",
  phoneCountryCode: "",
  phoneNumber: "",
  role: "",
}

const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggleVisibility,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="pr-11"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={onToggleVisibility}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">
            {visible ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, refreshCurrentUser } = useAuth()
  const { showError, showSuccess } = useToastMessage()
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE_FORM)
  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM)
  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const avatarFallback = useMemo(
    () =>
      (profile?.name || user?.name || "PalSalon User")
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [profile?.name, user?.name]
  )

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const currentProfile = await getProfile()
        setProfile(currentProfile)
        setProfileForm({
          name: currentProfile.name || "",
          email: currentProfile.email || "",
          phoneCountryCode: currentProfile.phoneCountryCode || "",
          phoneNumber: currentProfile.phoneNumber || "",
          role:
            currentProfile.roles?.[0] ||
            (currentProfile.role
              ? currentProfile.role.charAt(0).toUpperCase() + currentProfile.role.slice(1)
              : ""),
        })
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Unable to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleProfileFieldChange = (fieldName, value) => {
    setProfileForm((current) => ({
      ...current,
      [fieldName]: value,
    }))
  }

  const handlePasswordFieldChange = (fieldName, value) => {
    setPasswordForm((current) => ({
      ...current,
      [fieldName]: value,
    }))
  }

  const togglePasswordVisibility = (fieldName) => {
    setVisiblePasswords((current) => ({
      ...current,
      [fieldName]: !current[fieldName],
    }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setIsSavingProfile(true)

    try {
      const nextProfile = await updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phoneCountryCode: profileForm.phoneCountryCode.trim() || null,
        phoneNumber: profileForm.phoneNumber.trim() || null,
      })

      setProfile(nextProfile)
      await refreshCurrentUser()
      showSuccess("Profile updated successfully.")
    } catch (error) {
      showError(error, "Unable to update profile")
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError(
        { message: "New password and confirm password must match" },
        "Unable to update password"
      )
      return
    }

    setIsSavingPassword(true)

    try {
      await updateProfilePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })

      setPasswordForm(EMPTY_PASSWORD_FORM)
      setVisiblePasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      })
      showSuccess("Password updated successfully.")
    } catch (error) {
      showError(error, "Unable to update password")
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-[620px] w-full rounded-xl" />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Account"
        description="View and update your profile information and change your password."
      />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold">
                {avatarFallback || "PS"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                {profile?.name || "PalSalon User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile?.email || "No email address"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{profile?.email || "No email address"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>
                {[profile?.phoneCountryCode, profile?.phoneNumber]
                  .filter(Boolean)
                  .join(" ") || "No phone number"}
              </span>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{profileForm.role || "No role assigned"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update the personal details shown across the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input
                    id="profile-name"
                    value={profileForm.name}
                    onChange={(event) =>
                      handleProfileFieldChange("name", event.target.value)
                    }
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(event) =>
                      handleProfileFieldChange("email", event.target.value)
                    }
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone-code">Country Phone Code</Label>
                  <Input
                    id="profile-phone-code"
                    value={profileForm.phoneCountryCode}
                    onChange={(event) =>
                      handleProfileFieldChange(
                        "phoneCountryCode",
                        event.target.value
                      )
                    }
                    placeholder="+970"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone-number">Phone Number</Label>
                  <Input
                    id="profile-phone-number"
                    value={profileForm.phoneNumber}
                    onChange={(event) =>
                      handleProfileFieldChange("phoneNumber", event.target.value)
                    }
                    placeholder="599123456"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="profile-role">Role</Label>
                  <Input
                    id="profile-role"
                    value={profileForm.role}
                    disabled
                    readOnly
                    placeholder="Role"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your role is managed by administrators and cannot be changed here.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Enter your current password before choosing a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <UserCircle2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Security reminder</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Password changes are handled separately from profile edits and
                      never expose your current password.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <PasswordField
                  id="current-password"
                  label="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(value) =>
                    handlePasswordFieldChange("currentPassword", value)
                  }
                  visible={visiblePasswords.currentPassword}
                  onToggleVisibility={() =>
                    togglePasswordVisibility("currentPassword")
                  }
                  placeholder="Current password"
                />

                <PasswordField
                  id="new-password"
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={(value) =>
                    handlePasswordFieldChange("newPassword", value)
                  }
                  visible={visiblePasswords.newPassword}
                  onToggleVisibility={() => togglePasswordVisibility("newPassword")}
                  placeholder="At least 8 characters"
                />

                <PasswordField
                  id="confirm-password"
                  label="Confirm Password"
                  value={passwordForm.confirmPassword}
                  onChange={(value) =>
                    handlePasswordFieldChange("confirmPassword", value)
                  }
                  visible={visiblePasswords.confirmPassword}
                  onToggleVisibility={() =>
                    togglePasswordVisibility("confirmPassword")
                  }
                  placeholder="Repeat the new password"
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSavingPassword}>
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { ImageOff } from "lucide-react"

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const uploadsBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "")

const resolveImageUrl = (image) => {
  if (!image) {
    return ""
  }

  if (/^(https?:\/\/|blob:|data:)/i.test(image)) {
    return image
  }

  return `${uploadsBaseUrl}${image.startsWith("/") ? image : `/${image}`}`
}

export default function CityImagePreview({
  image,
  alt = "City image",
  className = "",
}) {
  const resolvedImageUrl = resolveImageUrl(image)
  const [hasImageError, setHasImageError] = useState(false)

  useEffect(() => {
    setHasImageError(false)
  }, [resolvedImageUrl])

  if (!resolvedImageUrl || hasImageError) {
    return (
      <div
        className={`flex h-40 w-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/60 text-center text-muted-foreground ${className}`.trim()}
      >
        <ImageOff className="h-8 w-8" />
        <p className="mt-3 text-sm font-medium">No image preview</p>
        <p className="mt-1 max-w-[180px] text-xs text-muted-foreground">
          Add an image URL or path to preview the city image here.
        </p>
      </div>
    )
  }

  return (
    <img
      src={resolvedImageUrl}
      alt={alt}
      className={`h-40 w-[220px] rounded-xl border bg-muted object-cover shadow-sm ${className}`.trim()}
      onError={() => setHasImageError(true)}
    />
  )
}

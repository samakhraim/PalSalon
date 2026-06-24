export function resolveErrorMessage(
  error,
  fallbackMessage = "Something went wrong. Please try again."
) {
  const responseData = error?.response?.data

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message.trim()
  }

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    const messages = responseData.errors
      .map((item) => {
        if (typeof item === "string") {
          return item.trim()
        }

        if (typeof item?.message === "string") {
          return item.message.trim()
        }

        return ""
      })
      .filter(Boolean)

    if (messages.length > 0) {
      return messages.join(" ")
    }
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const messages = Object.values(responseData.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean)

    if (messages.length > 0) {
      return messages.join(" ")
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim()
  }

  return fallbackMessage
}

export function resolveSubmitSuccessMessage({
  mode,
  successMessage,
  createSuccessMessage,
  updateSuccessMessage,
}) {
  if (successMessage) {
    return successMessage
  }

  if (mode === "create") {
    return createSuccessMessage || "Created successfully."
  }

  if (mode === "edit" || mode === "update") {
    return updateSuccessMessage || "Updated successfully."
  }

  return "Saved successfully."
}

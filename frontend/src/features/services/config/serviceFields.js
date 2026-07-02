const createDefaultPriceOption = () => ({
  name: {
    en: "",
    ar: "",
  },
  price: "",
  discount_price: "",
  duration_minutes: "",
  is_default: true,
  isactive: true,
})

export function createDefaultPriceOptions() {
  return [createDefaultPriceOption()]
}

const validatePositiveNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null
  }

  const parsedValue = Number(value)

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return "Must be a positive number."
  }

  return null
}

const validatePriceOptions = (priceOptions) => {
  if (!Array.isArray(priceOptions) || priceOptions.length === 0) {
    return "At least one price option is required."
  }

  let defaultCount = 0

  for (const [index, option] of priceOptions.entries()) {
    const optionLabel = `Price option ${index + 1}`
    const nameEn = option?.name?.en?.trim() || ""
    const price = option?.price
    const discountPrice = option?.discount_price
    const durationMinutes = option?.duration_minutes

    if (!nameEn) {
      return `${optionLabel}: English name is required.`
    }

    const priceError = validatePositiveNumber(price)
    if (priceError) {
      return `${optionLabel}: Price ${priceError.toLowerCase()}`
    }

    const discountError = validatePositiveNumber(discountPrice)
    if (discountPrice !== "" && discountPrice !== null && discountPrice !== undefined && discountError) {
      return `${optionLabel}: Discount price ${discountError.toLowerCase()}`
    }

    if (
      discountPrice !== "" &&
      discountPrice !== null &&
      discountPrice !== undefined &&
      Number(discountPrice) >= Number(price)
    ) {
      return `${optionLabel}: Discount price must be less than price.`
    }

    const durationError = validatePositiveNumber(durationMinutes)
    if (
      durationMinutes !== "" &&
      durationMinutes !== null &&
      durationMinutes !== undefined &&
      durationError
    ) {
      return `${optionLabel}: Duration ${durationError.toLowerCase()}`
    }

    if (option?.is_default) {
      defaultCount += 1
    }
  }

  if (defaultCount > 1) {
    return "Only one price option can be marked as default."
  }

  return null
}

export function getServiceFields({
  salonOptions = [],
  categoryOptions = [],
} = {}) {
  return [
    {
      name: "mainImageUrl",
      label: "Main Image",
      type: "image",
      span: 2,
      accept: "image/*",
      layoutArea: "mediaTop",
      previewVariant: "avatar",
      previewWidth: 112,
      previewHeight: 112,
      uploadLabel: "Upload Main Image",
      defaultValue: "",
    },
    {
      name: "isactive",
      label: "Status",
      type: "switch",
      span: 2,
      layoutArea: "statusTop",
      defaultValue: false,
    },
    {
      name: "salon_id",
      label: "Salon",
      type: "select",
      required: true,
      options: salonOptions,
      span: 2,
      placeholder: "Select salon",
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      required: true,
      options: categoryOptions,
      span: 2,
      placeholder: "Select category",
    },
    {
      name: "name.en",
      label: "Name (English)",
      type: "text",
      required: true,
    },
    {
      name: "name.ar",
      label: "Name (Arabic)",
      type: "text",
      dir: "rtl",
    },
    {
      name: "description.en",
      label: "Description (English)",
      type: "textarea",
    },
    {
      name: "description.ar",
      label: "Description (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
    {
      name: "duration_minutes",
      label: "Duration Minutes",
      type: "number",
      validate: (value) =>
        value === "" || value === null || value === undefined
          ? null
          : Number(value) > 0
            ? null
            : "Duration must be a positive number.",
    },
    {
      name: "price_options",
      label: "Price Options",
      type: "priceOptions",
      required: true,
      span: 2,
      defaultValue: createDefaultPriceOptions,
      description:
        "Add one or more price options. If nothing is marked default, the first option will be treated as default.",
      validate: validatePriceOptions,
    },
    {
      name: "gallery",
      label: "Gallery Images",
      type: "imageGallery",
      span: 2,
      accept: "image/*",
      defaultValue: [],
      description:
        "Upload one or more gallery images. Existing gallery images stay visible while you add more.",
    },
  ]
}

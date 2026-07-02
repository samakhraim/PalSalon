const formatMoney = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-"
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

const getPriceValues = (service) =>
  (service.price_options || [])
    .map((option) => Number(option.price))
    .filter((price) => !Number.isNaN(price))

export const getServicePriceDisplay = (service) => {
  const prices = getPriceValues(service)

  if (prices.length === 0) {
    return "-"
  }

  if (prices.length === 1) {
    return formatMoney(prices[0])
  }

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  if (minPrice === maxPrice) {
    return `From ${formatMoney(minPrice)}`
  }

  return `${formatMoney(minPrice)} - ${formatMoney(maxPrice)}`
}

const getServiceDurationDisplay = (service) => {
  const serviceDuration = Number(service.duration_minutes)

  if (!Number.isNaN(serviceDuration) && serviceDuration > 0) {
    return `${serviceDuration} min`
  }

  const durations = (service.price_options || [])
    .map((option) => Number(option.duration_minutes))
    .filter((duration) => !Number.isNaN(duration) && duration > 0)

  if (durations.length === 0) {
    return "-"
  }

  return `${Math.min(...durations)} min`
}

export const serviceColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "imageUrl",
    label: "Main Image",
    type: "image",
    sortable: false,
    searchable: false,
  },
  {
    key: "name.en",
    label: "Service Name",
    sortable: true,
    searchValue: (service) =>
      [service.name?.en, service.name?.ar].filter(Boolean).join(" "),
  },
  {
    key: "salon.name.en",
    label: "Salon",
    sortable: true,
    render: (service) =>
      service.salon?.name?.en || service.salon?.name?.ar || "-",
    searchValue: (service) =>
      [service.salon?.name?.en, service.salon?.name?.ar].filter(Boolean).join(" "),
    sortValue: (service) => service.salon?.name?.en || service.salon?.name?.ar || "",
  },
  {
    key: "category.name.en",
    label: "Category",
    sortable: true,
    render: (service) =>
      service.category?.name?.en || service.category?.name?.ar || "-",
    searchValue: (service) =>
      [service.category?.name?.en, service.category?.name?.ar]
        .filter(Boolean)
        .join(" "),
    sortValue: (service) =>
      service.category?.name?.en || service.category?.name?.ar || "",
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: getServicePriceDisplay,
    searchValue: getServicePriceDisplay,
    sortValue: (service) => {
      const prices = getPriceValues(service)
      return prices.length > 0 ? Math.min(...prices) : 0
    },
  },
  {
    key: "duration_minutes",
    label: "Duration",
    sortable: true,
    render: getServiceDurationDisplay,
    searchValue: getServiceDurationDisplay,
    sortValue: (service) => {
      const duration = Number(service.duration_minutes)

      if (!Number.isNaN(duration) && duration > 0) {
        return duration
      }

      const optionDurations = (service.price_options || [])
        .map((option) => Number(option.duration_minutes))
        .filter((value) => !Number.isNaN(value) && value > 0)

      return optionDurations.length > 0 ? Math.min(...optionDurations) : 0
    },
  },
  {
    key: "isactive",
    label: "Status",
    type: "status",
    sortable: true,
  },
]

const openingHoursDays = [
  { value: "monday", label: "Monday", defaultOpeningTime: "09:00", defaultClosingTime: "18:00" },
  { value: "tuesday", label: "Tuesday", defaultOpeningTime: "09:00", defaultClosingTime: "18:00" },
  { value: "wednesday", label: "Wednesday", defaultOpeningTime: "09:00", defaultClosingTime: "18:00" },
  { value: "thursday", label: "Thursday", defaultOpeningTime: "09:00", defaultClosingTime: "18:00" },
  { value: "friday", label: "Friday", defaultOpeningTime: "09:00", defaultClosingTime: "18:00" },
  { value: "saturday", label: "Saturday", defaultOpeningTime: "10:00", defaultClosingTime: "17:00" },
  { value: "sunday", label: "Sunday", defaultOpeningTime: "10:00", defaultClosingTime: "17:00" },
]

export function createDefaultOpeningHours() {
  return openingHoursDays.reduce((result, day) => {
    result[day.value] = {
      is_open: false,
      opening_time: null,
      closing_time: null,
    }

    return result
  }, {})
}

export function getSalonFields({
  salonOwnerOptions = [],
  cityOptions = [],
} = {}) {
  return [
    {
      name: "mainImageUrl",
      label: "Salon Main Image",
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
      name: "salon_owner_id",
      label: "Salon Owner",
      type: "select",
      required: true,
      options: salonOwnerOptions,
      span: 2,
      placeholder: "Select salon owner",
    },
    {
      name: "city_id",
      label: "City",
      type: "select",
      options: cityOptions,
      span: 2,
      placeholder: "Select city",
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
      name: "address.en",
      label: "Address (English)",
      type: "textarea",
    },
    {
      name: "address.ar",
      label: "Address (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
    {
      name: "cancellation_policy.en",
      label: "Cancellation Policy (English)",
      type: "textarea",
    },
    {
      name: "cancellation_policy.ar",
      label: "Cancellation Policy (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
    {
      name: "salon_mobile_group",
      label: "Country Phone Code / Phone Number",
      type: "phoneGroup",
      codeFieldName: "country_phone_code",
      phoneFieldName: "phone_number",
      codePlaceholder: "+970",
      phonePlaceholder: "599123456",
    },
    {
      name: "salon_telephone_group",
      label: "City Phone Code / Telephone",
      type: "phoneGroup",
      codeFieldName: "city_phone_code",
      phoneFieldName: "telephone",
      codePlaceholder: "02",
      phonePlaceholder: "2345678",
    },
    {
      name: "country_phone_code",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "city_phone_code",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "telephone",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "phone_number",
      type: "hidden",
      defaultValue: "",
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "text",
      placeholder: "31.7683",
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "text",
      placeholder: "35.2137",
    },
    {
      name: "map_developer_mode",
      label: "Google Map Developer Mode",
      type: "mapDeveloperMode",
      span: 2,
      latitudeFieldName: "latitude",
      longitudeFieldName: "longitude",
      defaultLatitude: "32.22111",
      defaultLongitude: "35.25444",
      locationLabel: "Nablus, West Bank, Palestine",
      zoom: 13,
      description:
        "Developer mode centered on Nablus, West Bank, Palestine. Use the button to auto-fill Nablus coordinates, or edit latitude and longitude manually.",
    },
    {
      name: "opening_hours",
      label: "Opening Hours",
      type: "openingHours",
      span: 2,
      days: openingHoursDays,
      defaultValue: createDefaultOpeningHours,
      description:
        "Set the weekly opening schedule. Closed days will save null times automatically.",
    },
    {
      name: "off_days",
      label: "Off Days",
      type: "dateList",
      span: 2,
      defaultValue: [],
      description:
        "Add special off dates such as holidays. These are saved separately from weekly opening hours.",
    },
    {
      name: "gallery",
      label: "Gallery Images",
      type: "imageGallery",
      span: 2,
      accept: "image/*",
      defaultValue: [],
      description:
        "Upload one or more gallery images. Existing images are shown below when available.",
    },
  ]
}

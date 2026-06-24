export const countryOptions = [
  { value: "PS", label: "Palestine", phoneCode: "+970" },
  { value: "SA", label: "Saudi Arabia", phoneCode: "+966" },
  { value: "AE", label: "UAE", phoneCode: "+971" },
  { value: "JO", label: "Jordan", phoneCode: "+962" },
  { value: "EG", label: "Egypt", phoneCode: "+20" },
  { value: "QA", label: "Qatar", phoneCode: "+974" },
  { value: "KW", label: "Kuwait", phoneCode: "+965" },
  { value: "BH", label: "Bahrain", phoneCode: "+973" },
  { value: "OM", label: "Oman", phoneCode: "+968" },
  { value: "LB", label: "Lebanon", phoneCode: "+961" },
]

export function getCountryOptionByPhoneCode(phoneCode = "") {
  const normalizedCode = String(phoneCode || "").trim()
  return countryOptions.find((country) => country.phoneCode === normalizedCode) || null
}

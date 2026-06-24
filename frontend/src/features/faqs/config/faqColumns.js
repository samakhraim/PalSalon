const getLocalizedText = (value) => value?.en || value?.ar || "-"

export const faqColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "question",
    label: "Question",
    sortable: true,
    render: (faq) => getLocalizedText(faq.question),
    searchValue: (faq) => [faq.question?.en, faq.question?.ar].filter(Boolean).join(" "),
    sortValue: (faq) => faq.question?.en || faq.question?.ar || "",
  },
  {
    key: "answer",
    label: "Answer",
    sortable: true,
    render: (faq) => getLocalizedText(faq.answer),
    searchValue: (faq) => [faq.answer?.en, faq.answer?.ar].filter(Boolean).join(" "),
    sortValue: (faq) => faq.answer?.en || faq.answer?.ar || "",
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
    sortable: true,
  },
]

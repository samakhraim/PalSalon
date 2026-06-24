export function getFaqFields() {
  return [
    {
      name: "question.en",
      label: "Question (English)",
      type: "textarea",
      required: true,
    },
    {
      name: "question.ar",
      label: "Question (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
    {
      name: "answer.en",
      label: "Answer (English)",
      type: "textarea",
      required: true,
    },
    {
      name: "answer.ar",
      label: "Answer (Arabic)",
      type: "textarea",
      dir: "rtl",
    },
  ]
}

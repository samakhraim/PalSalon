import { Badge } from "@/components/ui/badge"

const renderMessagePreview = (message) => {
  if (!message) {
    return "-"
  }

  if (message.length <= 120) {
    return message
  }

  return `${message.slice(0, 117)}...`
}

export const contactUsColumns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
  },
  {
    key: "message",
    label: "Message",
    sortable: true,
    render: (row) => renderMessagePreview(row.message),
    searchValue: (row) => row.message || "",
  },
  {
    key: "isRead",
    label: "Is Read",
    sortable: true,
    render: (row) => (
      <Badge variant={row.isRead ? "default" : "secondary"}>
        {row.isRead ? "Read" : "Unread"}
      </Badge>
    ),
    searchValue: (row) => (row.isRead ? "Read" : "Unread"),
    sortValue: (row) => (row.isRead ? 1 : 0),
  },
]

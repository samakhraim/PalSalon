import { useEffect, useState } from "react"
import { MailCheck, MailOpen, Trash2 } from "lucide-react"

import IndexPage from "@/components/common/IndexPage"
import { contactUsColumns } from "@/features/contactUs/config/contactUsColumns"
import {
  deleteContactMessage,
  getContactMessages,
  markContactAsRead,
  markContactAsUnread,
} from "@/features/contactUs/contactUsService"
import { useToastMessage } from "@/hooks/useToastMessage"

export default function ContactUsPage() {
  const { showError, showSuccess } = useToastMessage()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const loadMessages = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      setMessages(await getContactMessages())
    } catch (error) {
      setErrorMessage(showError(error, "Unable to load contact messages"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleMarkRead = async (messageId) => {
    try {
      await markContactAsRead(messageId)
      showSuccess("Message marked as read.")
      await loadMessages()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to mark message as read"))
    }
  }

  const handleMarkUnread = async (messageId) => {
    try {
      await markContactAsUnread(messageId)
      showSuccess("Message marked as unread.")
      await loadMessages()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to mark message as unread"))
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteContactMessage(messageId)
      showSuccess("Message deleted successfully.")
      await loadMessages()
    } catch (error) {
      setErrorMessage(showError(error, "Unable to delete message"))
    }
  }

  return (
    <IndexPage
      title="Contact Us"
      description="Review contact messages sent from the public contact form."
      managePermission="ContactUs-manage"
      data={messages}
      columns={contactUsColumns}
      loading={isLoading}
      error={errorMessage}
      emptyMessage="No contact messages found."
      actions={(message) => [
        message.isRead
          ? {
              label: "Mark as Unread",
              icon: MailOpen,
              onClick: () => handleMarkUnread(message.id),
              permission: "ContactUs-manage",
            }
          : {
              label: "Mark as Read",
              icon: MailCheck,
              onClick: () => handleMarkRead(message.id),
              permission: "ContactUs-manage",
            },
        {
          label: "Delete",
          icon: Trash2,
          destructive: true,
          confirm: true,
          confirmTitle: "Delete message",
          confirmDescription: `This action will permanently remove the message from ${message.name}.`,
          confirmLabel: "Delete",
          onClick: () => handleDeleteMessage(message.id),
          permission: "ContactUs-manage",
        },
      ]}
    />
  )
}

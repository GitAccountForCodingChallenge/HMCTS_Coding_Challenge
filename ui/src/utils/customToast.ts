import {toast} from "react-toastify"

const messages = {
    created: (type: string) => `${type} created successfully.`,
    updated: (type: string) => `${type} updated successfully.`,
    deleted: (type: string) => `${type} deleted successfully.`
}

export const customToast = {
    success: {
        created: (type: string) => toast.success(messages.created(type)),
        updated: (type: string) => toast.success(messages.updated(type)),
        deleted: (type: string) => toast.success(messages.deleted(type)),
        custom: (message: string) => toast.success(message)
    },
    error: (message: string) => toast.error(message)
}
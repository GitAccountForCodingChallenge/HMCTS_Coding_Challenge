import * as Yup from "yup"
import {columns} from "../../board/taskColumns"

export const taskValidationConfig = {
    title: {
        maxLength: 40
    },
    description: {
        maxLength: 100
    }
} as const

export const taskValidationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .required("Task title is required")
        .max(
            taskValidationConfig.title.maxLength,
            `Title must be ${taskValidationConfig.title.maxLength} characters or less`
        ),
    description: Yup.string()
        .max(
            taskValidationConfig.description.maxLength,
            `Description must be ${taskValidationConfig.description.maxLength} characters or less`
        ),
    status: Yup.string()
        .oneOf(columns.map((column) => column.id))
        .required("Status is required"),
    dueDate: Yup.string()
        .required("Due date is required")
        .test(
            "valid-future-date",
            "Due date must be in the future",
            (value) => {
                if (!value) {
                    return true
                }

                const dueDate = new Date(value).getTime()

                return (!Number.isNaN(dueDate) && dueDate > Date.now())
            }
        )
})

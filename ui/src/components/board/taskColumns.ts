import type {TaskPostBody} from "../../services/generated/tasksApi"

export type TaskStatus = TaskPostBody["status"]

export interface TaskColumnConfig {
    id: TaskStatus
    title: string
    colour: string
}

export const columns = [
    {
        id: "PENDING",
        title: "Pending",
        colour: "secondary"
    },
    {
        id: "IN PROGRESS",
        title: "In Progress",
        colour: "warning"
    },
    {
        id: "COMPLETED",
        title: "Completed",
        colour: "success"
    },
] satisfies TaskColumnConfig[]

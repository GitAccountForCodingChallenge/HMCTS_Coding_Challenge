import type {Task} from "../services/generated/tasksApi"

const DAY_IN_MS = 24 * 60 * 60 * 1000

export const getTaskBorderClass = (task: Task, now: number): string => {
    if (task.status === "COMPLETED") {
        return ""
    }

    const dueDate = new Date(task.dueDate).getTime()

    if (Number.isNaN(dueDate)) {
        return ""
    }

    const timeRemaining = dueDate - now

    if (timeRemaining <= DAY_IN_MS) {
        return "border-danger"
    }

    if (timeRemaining <= 7 * DAY_IN_MS) {
        return "border-warning"
    }

    return ""
}

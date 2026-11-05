import {getTaskBorderClass} from "./getTaskBorderClass"
import type {Task} from "../services/generated/tasksApi"

describe("getTaskBorderClass", () => {
    const now = new Date("2026-11-05T12:00:00Z").getTime()

    const createTask = (overrides: Partial<Task> = {}): Task => ({
        taskId: 1,
        title: "Test Task",
        description: "Test description",
        status: "PENDING",
        dueDate: "2026-11-20T12:00:00Z",
        ...overrides
    })

    it("should return danger for overdue tasks", () => {
        const task = createTask({dueDate: "2026-11-04T12:00:00Z"});
        expect(getTaskBorderClass(task, now)).toBe("border-danger")
    })

    it("should return danger for tasks due within 24 hours", () => {
        const task = createTask({dueDate: "2026-11-06T06:00:00Z"})
        expect(getTaskBorderClass(task, now)).toBe("border-danger")
    })

    it("should return warning for tasks due within 7 days", () => {
        const task = createTask({dueDate: "2026-11-10T12:00:00Z"})
        expect(getTaskBorderClass(task, now)).toBe("border-warning")
    })

    it("should return a normal border for distant deadlines", () => {
        const task = createTask()
        expect(getTaskBorderClass(task, now)).toBe("")
    })

    it("should return a normal border for completed tasks", () => {
        const task = createTask({status: "COMPLETED", dueDate: "2026-11-01T12:00:00Z"})
        expect(getTaskBorderClass(task, now)).toBe("")
    })

    it("should return a normal border for invalid dates", () => {
        const task = createTask({dueDate: "invalid-date"})
        expect(getTaskBorderClass(task, now)).toBe("")
    })
})

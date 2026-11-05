import {taskValidationSchema, taskValidationConfig} from "./taskValidationSchema"

describe("taskValidationSchema", () => {
    const validTask = {
        title: "My Task",
        description: "Task description",
        status: "PENDING",
        dueDate: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ).toISOString()
    }

    it("should accept a valid task", async () => {
        await expect(taskValidationSchema.validate(validTask)).resolves.toBeDefined()
    })

    it("should reject an empty title", async () => {
        await expect(taskValidationSchema.validate({...validTask, title: ""}))
            .rejects.toThrow("Task title is required")
    })

    it("should reject a title exceeding the configured maximum", async () => {
        const tooLongTitle = "a".repeat(taskValidationConfig.title.maxLength + 1)

        await expect(taskValidationSchema.validate({...validTask, title: tooLongTitle})
        ).rejects.toThrow(
            `Title must be ${taskValidationConfig.title.maxLength} characters or less`
        )
    })

    it("should reject a due date in the past", async () => {
        await expect(taskValidationSchema.validate({
                ...validTask,
                dueDate: new Date(
                    Date.now() - 60000
                ).toISOString()
            })
        ).rejects.toThrow("Due date must be in the future")
    })

    it("should reject an invalid status", async () => {
        await expect(taskValidationSchema.validate({...validTask, status: "INVALID"})
        ).rejects.toThrow();
    })
})

import {render, screen} from "@testing-library/react"
import TaskDetailsCard from "./TaskDetailsCard"
import type {Task} from "../../services/generated/tasksApi"

const task: Task = {
    taskId: 1,
    title: "Finish Coding Challenge",
    description: "Complete the application",
    status: "IN PROGRESS",
    dueDate: "2026-12-31T12:00:00Z"
}

describe("TaskDetailsCard", () => {
    it("should display the selected task details", () => {
        render(<TaskDetailsCard task={task} />)

        expect(screen.getByRole("heading", {name: "Finish Coding Challenge",})).toBeInTheDocument()

        expect(screen.getByText("Complete the application")).toBeInTheDocument()

        expect(screen.getByText(/Due date:/)).toBeInTheDocument()
    })

    it.each([
        ["PENDING", "Pending", "bg-secondary"],
        ["IN PROGRESS", "In Progress", "bg-warning"],
        ["COMPLETED", "Completed", "bg-success"]
    ] as const)(
        "displays the correct badge for %s",
        (status, label, colourClass) => {
            render(<TaskDetailsCard task={{ ...task, status }} />)

            const badge = screen.getByText(label)

            expect(badge).toHaveClass("badge")
            expect(badge).toHaveClass(colourClass)
        }
    )

    it("should not render an empty description", () => {
        render(
            <TaskDetailsCard task={{ ...task, description: undefined }}/>
        )

        expect(screen.queryByText("Complete the application")).not.toBeInTheDocument();
    });
});
import {render, screen} from "@testing-library/react"
import TaskBadge from "./TaskBadge"

describe("TaskBadge", () => {
    it("should render the badge text", () => {
        render(
            <TaskBadge colour={"success"}>
                Completed
            </TaskBadge>
        )

        expect(screen.getByText("Completed")).toBeInTheDocument()
    })

    it("should use the correct Bootstrap background colour", () => {
        render(
            <TaskBadge colour={"warning"}>
                In Progress
            </TaskBadge>
        )

        const badge = screen.getByText("In Progress")

        expect(badge).toHaveClass("bg-warning")
        expect(badge).toHaveClass("text-dark")
    })

    it("should render a square count badge", () => {
        render(
            <TaskBadge colour={"secondary"} square>
                5
            </TaskBadge>
        )

        const badge = screen.getByText("5")

        expect(badge).toHaveStyle({
            width: "36px",
            height: "36px"
        })
    })
})

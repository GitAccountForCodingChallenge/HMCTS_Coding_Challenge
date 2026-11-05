import {act, screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {http, HttpResponse} from "msw"
import SearchPage from "./SearchPage"
import {renderWithProviders} from "../test/renderWithProviders"
import {server} from "../test/server"

const API_URL = "http://localhost:8080"

const taskSummaries = [
    { taskId: 1, title: "Finish Coding Challenge" },
    { taskId: 2, title: "Review Best Practices" },
    { taskId: 3, title: "Book Christmas Party" }
]

describe("SearchPage", () => {
    it("should show initial search guidance", () => {
        renderWithProviders(<SearchPage />)

        expect(screen.getByRole("searchbox", {name: "Search tasks"})).toHaveValue("")
        expect(screen.getByText("Search for a task to view its details.")).toBeInTheDocument()
        expect(screen.queryByText("Finish Coding Challenge")).not.toBeInTheDocument()
    })

    it("should not search when fewer than 3 characters are entered", async () => {
        const user = userEvent.setup()
        let requestCount = 0

        server.use(
            http.get("*/tasks/summaries", () => {
                requestCount++
                HttpResponse.json(taskSummaries)
            })
        )

        renderWithProviders(<SearchPage />)

        await user.type(
            screen.getByRole("searchbox", {
                name: "Search tasks"
            }),
            "re"
        )

        expect(screen.getAllByText("Enter at least 3 characters to search.")).toHaveLength(2)

        await act(async () => {
            await new Promise((resolve) =>
                setTimeout(resolve, 400)
            )
        })

        expect(requestCount).toBe(0)
    })

    it("should debounce the search before displaying results", async () => {
        const user = userEvent.setup()

        server.use(
            http.get("*/tasks/summaries", () =>
                HttpResponse.json(taskSummaries)
            )
        )

        renderWithProviders(<SearchPage />)

        await user.type(
            screen.getByRole("searchbox", {
                name: "Search tasks"
            }),
            "rev"
        )

        expect(screen.queryByText("Review Best Practices")).not.toBeInTheDocument()
        expect(await screen.findByText("Review Best Practices")).toBeInTheDocument()
    })

    it("should filter tasks by title regardless of case", async () => {
        const user = userEvent.setup()

        server.use(
            http.get("*/tasks/summaries", () =>
                HttpResponse.json(taskSummaries)
            )
        )

        renderWithProviders(<SearchPage />)

        await user.type(
            screen.getByRole("searchbox", {
                name: "Search tasks"
            }),
            "REVIEW"
        )

        expect(await screen.findByText("Review Best Practices")).toBeInTheDocument()
        expect(screen.queryByText("Finish Coding Challenge")).not.toBeInTheDocument()
        expect(screen.queryByText("Book Christmas Party")).not.toBeInTheDocument()
    });

    it("should retrieve full task details when a result is selected", async () => {
        const user = userEvent.setup()
        const requestedIds: string[] = []

        server.use(
            http.get(`${API_URL}/tasks/summaries`, () =>
                HttpResponse.json(taskSummaries)
            ),

            http.get(`${API_URL}/tasks/:taskId`, ({ params }) => {
                requestedIds.push(String(params.taskId))

                return HttpResponse.json({
                    taskId: 1,
                    title: "Finish Coding Challenge",
                    description: "Complete the OpenAPI specification",
                    status: "IN PROGRESS",
                    dueDate: "2026-12-31T23:59:59Z"
                })
            })
        )

        renderWithProviders(<SearchPage />)

        await user.type(
            screen.getByRole("searchbox", {
                name: "Search tasks"
            }),
            "coding"
        )

        await user.click(
            await screen.findByRole("button", {
                name: "Finish Coding Challenge"
            })
        )

        expect(
            await screen.findByText("Complete the OpenAPI specification")
        ).toBeInTheDocument()

        expect(screen.getByText("In Progress")).toBeInTheDocument()

        await waitFor(() => {
            expect(requestedIds).toEqual(["1"])
        })
    })
})

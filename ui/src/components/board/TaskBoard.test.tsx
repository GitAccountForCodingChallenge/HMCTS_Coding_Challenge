import {fireEvent, screen, waitFor, within,} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {http, HttpResponse} from "msw"
import TaskBoard from "./TaskBoard"
import {renderWithProviders} from "../../test/renderWithProviders"
import {server} from "../../test/server"
import {mockTasks} from "../../test/handlers"
import "../../test/setupMsw";

const API_URL = "http://localhost:8080"

describe("TaskBoard", () => {

    it("should load and display tasks from the API", async () => {
        renderWithProviders(<TaskBoard />)

        expect(screen.getByRole("status")).toBeInTheDocument()

        expect(await screen.findByText("Write unit tests")).toBeInTheDocument()

        expect(screen.getByText("Review code")).toBeInTheDocument()

        expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })


    it("should display an error alert when fetching fails", async () => {
        server.use(
            http.get(`${API_URL}/tasks`, () =>
                HttpResponse.json(
                    { message: "Server unavailable" },
                    { status: 500 }
                )
            )
        )

        renderWithProviders(<TaskBoard />)

        expect(await screen.findByText("Failed to load tasks")).toBeInTheDocument()

        expect(screen.queryByText("Write unit tests")).not.toBeInTheDocument()
    })


    it("should open the create task modal", async () => {
        const user = userEvent.setup()

        renderWithProviders(<TaskBoard />)

        await screen.findByText("Write unit tests")

        await user.click(
            screen.getByRole("button", {
                name: /Add Task/i
            })
        )

        const dialog = await screen.findByRole("dialog")

        expect(within(dialog).getByRole("heading", {name: "Create Task"})).toBeInTheDocument()

        expect(within(dialog).getByRole("button", {name: "Create Task"})).toBeInTheDocument()
    })


    it("should not delete a task when confirmation is cancelled", async () => {
        const user = userEvent.setup()
        let deleteRequests = 0

        server.use(
            http.delete(`${API_URL}/tasks/:taskId`, () => {
                deleteRequests++
                return new HttpResponse(null, { status: 204 })
            })
        )

        renderWithProviders(<TaskBoard />)

        await screen.findByText("Write unit tests")

        await user.click(screen.getAllByRole("button", { name: "Delete" })[0])

        const dialog = await screen.findByRole("dialog")

        await user.click(within(dialog).getByRole("button", {name: "Cancel"}))

        await waitFor(() => {
            expect(
                screen.queryByRole("dialog")
            ).not.toBeInTheDocument()
        })

        expect(deleteRequests).toBe(0)

        expect(screen.getByText("Write unit tests")).toBeInTheDocument()
    })

    it("should send a delete request after confirmation", async () => {
        const user = userEvent.setup()
        const deletedIds: string[] = []

        server.use(
            http.delete(
                `${API_URL}/tasks/:taskId`,
                ({ params }) => {
                    deletedIds.push(String(params.taskId))
                    return new HttpResponse(null, { status: 204 })
                }
            )
        )

        renderWithProviders(<TaskBoard />)

        await screen.findByText("Write unit tests")

        await user.click(screen.getAllByRole("button", { name: "Delete" })[0])

        const dialog = await screen.findByRole("dialog")

        await user.click(within(dialog).getByRole("button", { name: "Delete" }))

        await waitFor(() => {expect(deletedIds).toEqual(["1"])})
    })

    it("should send a patch request when moving a task", async () => {
        const updates: Array<{ taskId: string; status: string; }> = []

        server.use(
            http.patch(
                `${API_URL}/tasks/:taskId`,
                async ({ params, request }) => {
                    const body = (await request.json()) as { status: string }

                    updates.push({taskId: String(params.taskId), status: body.status})

                    const originalTask = mockTasks.find(
                        (task) =>
                            task.taskId === Number(params.taskId)
                    )

                    return HttpResponse.json({...originalTask, status: body.status})
                }
            )
        )

        renderWithProviders(<TaskBoard />)

        const taskTitle = await screen.findByText("Write unit tests")

        const taskCard = taskTitle.closest(".card")

        expect(taskCard).not.toBeNull()

        const dataTransfer = {
            setData: jest.fn(),
            getData: jest.fn(() => "1"),
            effectAllowed: "move"
        }

        fireEvent.dragStart(taskCard!, { dataTransfer })

        const completedHeading = screen.getByRole("heading", { name: "Completed" })

        const completedColumn = completedHeading.parentElement?.parentElement

        expect(completedColumn).not.toBeNull()

        fireEvent.dragOver(completedColumn!, { dataTransfer })
        fireEvent.drop(completedColumn!, { dataTransfer })

        await waitFor(() => {
            expect(updates).toEqual([
                {
                    taskId: "1",
                    status: "COMPLETED"
                }
            ])
        })
    })

    it("should keep a task when deletion fails", async () => {
        const user = userEvent.setup()

        server.use(
            http.delete(
                `${API_URL}/tasks/:taskId`,
                () =>
                    HttpResponse.json(
                        { message: "Delete failed" },
                        { status: 500 }
                    )
            )
        )

        renderWithProviders(<TaskBoard />)

        await screen.findByText("Write unit tests")

        await user.click(screen.getAllByRole("button", { name: "Delete" })[0])

        const dialog = await screen.findByRole("dialog")

        await user.click(
            within(dialog).getByRole("button", { name: "Delete" })
        )

        expect(await screen.findByText("Write unit tests")).toBeInTheDocument()

        await waitFor(() => {
            expect(within(dialog).getByRole("button", { name: "Delete" })).toBeEnabled()
        })
    })

    it("should handle a failed task status update", async () => {
        const updates: string[] = []

        server.use(
            http.patch(
                `${API_URL}/tasks/:taskId`,
                ({ params }) => {
                    updates.push(String(params.taskId))

                    return HttpResponse.json(
                        { message: "Update failed" },
                        { status: 500 }
                    )
                }
            )
        )

        renderWithProviders(<TaskBoard />)

        const taskTitle = await screen.findByText("Write unit tests")

        const taskCard = taskTitle.closest(".card")

        expect(taskCard).not.toBeNull()

        const dataTransfer = {
            setData: jest.fn(),
            getData: jest.fn(() => "1"),
            effectAllowed: "move"
        }

        const completedHeading = screen.getByRole("heading", { name: "Completed" })

        const completedColumn = completedHeading.parentElement?.parentElement

        expect(completedColumn).not.toBeNull()

        fireEvent.dragStart(taskCard!, { dataTransfer })
        fireEvent.drop(completedColumn!, { dataTransfer })

        await waitFor(() => {
            expect(updates).toEqual(["1"])
        })

        expect(
            screen.getByText("Write unit tests")
        ).toBeInTheDocument()
    })
})

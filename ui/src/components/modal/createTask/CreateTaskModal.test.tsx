import {fireEvent, screen, waitFor, within} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {http, HttpResponse} from "msw"
import CreateTaskModal from "./CreateTaskModal"
import {renderWithProviders} from "../../../test/renderWithProviders"
import {server} from "../../../test/server"
import {customToast} from "../../../utils/customToast"
import "../../../test/setupMsw"

jest.mock("../../../utils/customToast", () => ({
    customToast: {
        success: {
            created: jest.fn(),
            updated: jest.fn(),
            deleted: jest.fn(),
            custom: jest.fn()
        },
        error: jest.fn()
    }
}))

const API_URL = "http://localhost:8080"

const getFutureDate = () => {
    const date = new Date(Date.now() + 48 * 60 * 60 * 1000)
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return localDate.toISOString().slice(0, 16)
}

const fillValidForm = async () => {
    const user = userEvent.setup()

    await user.type(
        screen.getByLabelText(/Task Title/i),
        "Write documentation"
    )

    await user.type(
        screen.getByLabelText(/Description/i),
        "Document the API"
    )

    await user.selectOptions(
        screen.getByLabelText(/Status/i),
        "IN PROGRESS"
    )

    fireEvent.change(screen.getByLabelText(/Due Date/i), {
        target: { value: getFutureDate() }
    })

    return user
}

describe("CreateTaskModal", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should create a task with valid form data", async () => {
        const onHide = jest.fn()
        const requests: unknown[] = []

        server.use(
            http.post(`${API_URL}/tasks`, async ({ request }) => {
                const body = await request.json()
                requests.push(body)

                return HttpResponse.json(
                    { taskId: 10, ...body as object },
                    { status: 201 }
                )
            })
        )

        renderWithProviders(<CreateTaskModal show onHide={onHide} />)

        const user = await fillValidForm()

        await user.click(screen.getByRole("button", { name: "Create Task" }))

        await waitFor(() => {
            expect(requests).toHaveLength(1)
        })

        expect(requests[0]).toEqual({
            title: "Write documentation",
            description: "Document the API",
            status: "IN PROGRESS",
            dueDate: expect.any(String)
        })

        await waitFor(() => {expect(onHide).toHaveBeenCalledTimes(1);})

        expect(customToast.success.created).toHaveBeenCalledWith("Task")
    })

    it("should prevent a submission when the title is missing", async () => {
        const user = userEvent.setup()
        let postRequests = 0

        server.use(
            http.post(`${API_URL}/tasks`, () => {
                postRequests++
                return HttpResponse.json({}, { status: 201 })
            })
        )

        renderWithProviders(<CreateTaskModal show onHide={jest.fn()} />)

        await user.click(
            screen.getByRole("button", { name: "Create Task" })
        )

        expect(await screen.findByText("Task title is required")).toBeInTheDocument()

        expect(postRequests).toBe(0)
    })

    it("should reject a due date in the past", async () => {
        const user = userEvent.setup()

        renderWithProviders(<CreateTaskModal show onHide={jest.fn()} />)

        await user.type(
            screen.getByLabelText(/Task Title/i),
            "Past due task"
        )

        fireEvent.change(screen.getByLabelText(/Due Date/i), {
            target: { value: "2020-01-01T12:00" }
        })

        await user.click(
            screen.getByRole("button", { name: "Create Task" })
        )

        expect(await screen.findByText("Due date must be in the future")).toBeInTheDocument()
    })

    it("keeps the modal open when the API fails", async () => {
        const onHide = jest.fn()

        server.use(
            http.post(`${API_URL}/tasks`, () =>
                HttpResponse.json(
                    { message: "Internal server error" },
                    { status: 500 }
                )
            )
        )

        renderWithProviders(<CreateTaskModal show onHide={onHide} />)

        const user = await fillValidForm()

        await user.click(
            screen.getByRole("button", { name: "Create Task" })
        )

        await waitFor(() => {
            expect(customToast.error).toHaveBeenCalledWith("Failed to create task.")
        })

        expect(onHide).not.toHaveBeenCalled()

        const dialog = screen.getByRole("dialog")

        expect(within(dialog).getByDisplayValue("Write documentation")).toBeInTheDocument()
    })

    it("should close the modal when Cancel is clicked", async () => {
        const user = userEvent.setup()
        const onHide = jest.fn()

        renderWithProviders(<CreateTaskModal show onHide={onHide} />)

        await user.click(
            screen.getByRole("button", { name: "Cancel" })
        )

        expect(onHide).toHaveBeenCalledTimes(1)
    })
})

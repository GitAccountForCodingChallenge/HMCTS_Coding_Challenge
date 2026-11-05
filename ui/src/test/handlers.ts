import {http, HttpResponse} from "msw"
import type {Task, TaskSummary, TaskPatchBody, TaskPostBody} from "../services/generated/tasksApi"

const API_URL = "http://localhost:8080"

export const mockTasks: Task[] = [
    {
        taskId: 1,
        title: "Write unit tests",
        description: "Add tests for the coding challenge",
        status: "PENDING",
        dueDate: "2026-12-10T12:30:00Z"
    },
    {
        taskId: 2,
        title: "Review code",
        description: "Review the UI and API",
        status: "IN PROGRESS",
        dueDate: "2026-12-15T12:30:00Z"
    }
]

export const handlers = [
    http.get(`${API_URL}/tasks`, () => {return HttpResponse.json(mockTasks)}),
    http.post(`${API_URL}/tasks`, async ({ request }) => {
        const body = (await request.json()) as TaskPostBody

        return HttpResponse.json(
            {
                taskId: 3,
                ...body,
            } satisfies Task,
            { status: 201 }
        )
    }),
    http.patch(`${API_URL}/tasks/:taskId`,
        async ({ params, request }) => {
            const body = (await request.json()) as TaskPatchBody

            const task = mockTasks.find((task) => task.taskId === Number(params.taskId))

            if (!task) {
                return HttpResponse.json(
                    { message: "Task not found" },
                    { status: 404 }
                )
            }

            return HttpResponse.json({
                ...task,
                ...body
            })
        }
    ),
    http.delete(`${API_URL}/tasks/:taskId`, () => {return new HttpResponse(null, { status: 204 })}),
    http.get(`${API_URL}/tasks/summaries`, () => {
        const summaries: TaskSummary[] = mockTasks.map(
            ({ taskId, title }) => ({
                taskId,
                title
            })
        )

        return HttpResponse.json(summaries)
    }),
    http.get(`${API_URL}/tasks/:taskId`, ({ params }) => {
        const task = mockTasks.find(
            (task) => task.taskId === Number(params.taskId)
        )

        if (!task) {
            return HttpResponse.json(
                { message: "Task not found" },
                { status: 404 }
            )
        }

        return HttpResponse.json(task)
    })
]

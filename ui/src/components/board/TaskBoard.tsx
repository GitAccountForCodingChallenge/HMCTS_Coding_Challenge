import type {DragEvent} from "react"
import {useState} from "react"
import {Container, Row} from "react-bootstrap"
import {
    useDeleteTaskByIdMutation,
    useGetTasksQuery,
    useUpdateTaskByIdMutation
} from "../../services/generated/tasksApi"
import CreateTaskModal from "../modal/createTask/CreateTaskModal"
import LoadingSpinner from "../common/LoadingSpinner"
import {useCurrentTime} from "../../hooks/useCurrentTime"
import TaskBoardHeader from "./TaskBoardHeader"
import TaskColumn from "./TaskColumn"
import type {TaskStatus} from "./taskColumns"
import {columns} from "./taskColumns"
import { customToast } from "../../utils/customToast"
import CustomAlert from "../common/CustomAlert"

export default function TaskBoard() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

    const now = useCurrentTime()

    const {data: tasks = [], isLoading, isError} = useGetTasksQuery()
    const [updateTaskById, {isLoading: isUpdating}] = useUpdateTaskByIdMutation()
    const [deleteTaskById] = useDeleteTaskByIdMutation()

    const handleMoveTask = async (taskId: number, status: TaskStatus) => {
        try {
            await updateTaskById({taskId, taskPatchBody: {status}}).unwrap()

            const statusLabel = columns.find((column) => column.id === status)?.title ?? status

            customToast.success.custom(`Task moved to ${statusLabel}`)
        } catch {
            customToast.error("Failed to update task.")
        }
    }

    const handleDeleteTask = async (taskId: number) => {
        if (deletingTaskId !== null) {
            return
        }

        setDeletingTaskId(taskId)

        try {
            await deleteTaskById({taskId}).unwrap()
            customToast.success.deleted("Task")
        } catch {
            customToast.error("Failed to delete task.")
        } finally {
            setDeletingTaskId(null)
        }
    }

    const handleDragStart = (event: DragEvent<HTMLElement>, taskId: number) => {
        event.dataTransfer.setData("text/plain", String(taskId))
        event.dataTransfer.effectAllowed = "move"
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>, status: TaskStatus) => {
        event.preventDefault()

        if (isUpdating) {
            return
        }

        const rawTaskId = event.dataTransfer.getData("text/plain")

        if (!rawTaskId) {
            return
        }

        const taskId = Number(rawTaskId)

        if (!Number.isInteger(taskId)) {
            return
        }

        const task = tasks.find((task) => task.taskId === taskId)

        if (task && task.status !== status) {
            {
                void handleMoveTask(taskId, status)
            }
        }
    }

    if (isLoading) {
        return (
            <LoadingSpinner text={"Loading tasks..."} variant={"primary"} centered />
        )
    }

    if (isError) {
        return (
            <Container className={"py-3"}>
                <CustomAlert
                    variant={"danger"}
                    title={"Failed to load tasks"}
                >
                    <p className={"mb-0"}>
                        Failed to load tasks. Please try again.
                    </p>
                </CustomAlert>
            </Container>
        )
    }

    return (
        <Container fluid className={"py-3"}>
            <TaskBoardHeader onAddTask={() => setShowCreateModal(true)} />
            <CreateTaskModal show={showCreateModal} onHide={() => setShowCreateModal(false)}/>
            <Row className={"g-3"}>
                {columns.map((column) => (
                    <TaskColumn
                        key={column.id}
                        column={column}
                        tasks={tasks.filter((task) => task.status === column.id)}
                        now={now}
                        deletingTaskId={deletingTaskId}
                        isUpdating={isUpdating}
                        onDelete={(taskId) => {void handleDeleteTask(taskId)}}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                    />
                ))}
            </Row>
        </Container>
    )
}

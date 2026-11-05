import type {DragEvent} from "react"
import {useState} from "react"
import {Button, Card} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCalendarDays, faTrash,} from "@fortawesome/free-solid-svg-icons"
import type {Task} from "../../services/generated/tasksApi"
import {getTaskBorderClass} from "../../utils/getTaskBorderClass"
import LoadingSpinner from "../common/LoadingSpinner"
import {columns} from "./taskColumns"
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog"
import TaskBadge from "../badge/TaskBadge"

interface TaskCardProps {
    task: Task
    colour: string
    now: number
    isDeleting: boolean
    isUpdating: boolean
    onDelete: (taskId: number) => void
    onDragStart: (
        event: DragEvent<HTMLElement>,
        taskId: number
    ) => void
}

export default function TaskCard({
                                     task,
                                     colour,
                                     now,
                                     isDeleting,
                                     isUpdating,
                                     onDelete,
                                     onDragStart
                                 }: TaskCardProps) {

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const borderClass = getTaskBorderClass(task, now)

    const formattedDueDate = new Date(task.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

    const statusLabel = columns.find((column) => column.id === task.status)?.title ?? task.status

    const deleteButton = () => (
        <Button
            variant={"outline-danger"}
            size={"sm"}
            disabled={isDeleting}
            onClick={() => setShowDeleteConfirmation(true)}
        >
            {isDeleting ? (
                <LoadingSpinner text={"Deleting..."} size={"sm"} />
            ) : (
                <>
                    <FontAwesomeIcon icon={faTrash} className={"me-2"} />
                    Delete
                </>
            )}
        </Button>
    )

    return (
        <>
            <Card
                className={`mb-3 shadow-sm border-2 rounded-3 ${borderClass}`}
                draggable={!isUpdating}
                onDragStart={(e) => onDragStart(e, task.taskId)}
            >
                <Card.Body>
                    <div className={"d-flex justify-content-between align-items-start gap-2 mb-3"}>
                        <Card.Title className={"mb-0 flex-grow-1 text-break"}>
                            {task.title}
                        </Card.Title>

                        <TaskBadge colour={colour}>
                            {statusLabel}
                        </TaskBadge>
                    </div>

                    {task.description && (
                        <Card.Text className={"text-muted text-break"}>
                            {task.description}
                        </Card.Text>
                    )}

                    <div className={"d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3"}>
                        {deleteButton()}

                        <span className={"text-muted small"}>
            <FontAwesomeIcon icon={faCalendarDays} className={"me-2"}/>
                            {formattedDueDate}
                    </span>
                    </div>
                </Card.Body>
            </Card>
            <ConfirmationDialog
                show={showDeleteConfirmation}
                onHideCallback={() => setShowDeleteConfirmation(false)}
                onConfirmCallback={() => onDelete(task.taskId)}
                title={"Delete Task"}
                text={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                isSubmitting={isDeleting}
                confirmVariant={"danger"}
                confirmText={"Delete"}
                loadingText={"Deleting..."}
            />
        </>
    )
}

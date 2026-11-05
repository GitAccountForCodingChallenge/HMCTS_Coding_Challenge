import type {DragEvent} from "react"
import {Col} from "react-bootstrap"
import type {Task} from "../../services/generated/tasksApi"
import type {TaskColumnConfig, TaskStatus,} from "./taskColumns"
import TaskCard from "./TaskCard"
import TaskBadge from "../badge/TaskBadge"

interface TaskColumnProps {
    column: TaskColumnConfig
    tasks: Task[]
    now: number
    deletingTaskId: number | null
    isUpdating: boolean
    onDelete: (taskId: number) => void
    onDragStart: (event: DragEvent<HTMLElement>, taskId: number) => void
    onDrop: (event: DragEvent<HTMLDivElement>, status: TaskStatus) => void
}

export default function TaskColumn({
                                       column,
                                       tasks,
                                       now,
                                       deletingTaskId,
                                       isUpdating,
                                       onDelete,
                                       onDragStart,
                                       onDrop
                                   }: TaskColumnProps) {
    return (
        <Col md={4}>
            <div
                className={"bg-light rounded p-3 h-100"}
                style={{ minHeight: 400 }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => onDrop(event, column.id)}
            >
                <div className={"d-flex justify-content-between align-items-center mb-3"}>
                    <h5 className={"mb-0"}>{column.title}</h5>
                    <TaskBadge colour={column.colour} square>
                        {tasks.length}
                    </TaskBadge>
                </div>

                {tasks.map((task) => (
                    <TaskCard
                        key={task.taskId}
                        task={task}
                        colour={column.colour}
                        now={now}
                        isDeleting={deletingTaskId === task.taskId}
                        isUpdating={isUpdating}
                        onDelete={onDelete}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </Col>
    )
}

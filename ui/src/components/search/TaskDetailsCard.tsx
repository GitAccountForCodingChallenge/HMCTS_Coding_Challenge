import {Card} from "react-bootstrap"
import type {Task} from "../../services/generated/tasksApi"
import TaskBadge from "../badge/TaskBadge"
import {getTaskBorderClass} from "../../utils/getTaskBorderClass"
import {columns} from "../board/taskColumns"
import {useCurrentTime} from "../../hooks/useCurrentTime"

type TaskDetailsCardProps = {
    task: Task
}

export default function TaskDetailsCard({task}: TaskDetailsCardProps) {
    const now = useCurrentTime()
    const column = columns.find((column) => column.id === task.status)

    return (
        <Card className={getTaskBorderClass(task, now)}>
            <Card.Body>
                <div className={"d-flex justify-content-between align-items-start gap-2 mb-3"}>
                    <Card.Title as={"h2"} className={"h5"}>
                        {task.title}
                    </Card.Title>

                    <TaskBadge colour={column?.colour ?? "secondary"}>
                        {column?.title ?? task.status}
                    </TaskBadge>
                </div>

                {task.description && (<Card.Text>{task.description}</Card.Text>)}

                <Card.Text className={"text-muted mb-0"}>
                    <strong>Due date:</strong>{" "}
                    {new Date(task.dueDate).toLocaleString("en-GB")}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}
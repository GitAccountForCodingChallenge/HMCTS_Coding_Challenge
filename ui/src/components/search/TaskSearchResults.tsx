import {ListGroup} from "react-bootstrap"
import type {TaskSummary} from "../../services/generated/tasksApi"
import LoadingSpinner from "../common/LoadingSpinner"
import CustomAlert from "../common/CustomAlert"

type TaskSearchResultsProps = {
    tasks: TaskSummary[]
    selectedTaskId: number | null
    isLoading: boolean
    isError: boolean
    onSelect: (taskId: number) => void
};

export default function TaskSearchResults({
                                              tasks,
                                              selectedTaskId,
                                              isLoading,
                                              isError,
                                              onSelect,
                                          }: TaskSearchResultsProps) {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return (
            <CustomAlert variant={"danger"} title={"Search failed"}>
                Unable to load tasks. Please try again.
            </CustomAlert>
        )
    }

    if (tasks.length === 0) {
        return (
            <p className={"text-muted"}>
                No tasks match your search.
            </p>
        )
    }

    return (
        <>
            <h2 className={"h5 mb-3"}>Search results</h2>

            <ListGroup aria-label={"Task search results"}>
                {tasks.map((task) => (
                    <ListGroup.Item
                        key={task.taskId}
                        action
                        active={selectedTaskId === task.taskId}
                        onClick={() => onSelect(task.taskId)}
                    >
                        {task.title}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )
}
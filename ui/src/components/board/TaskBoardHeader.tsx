import {Button, OverlayTrigger, Tooltip} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleInfo, faPlus} from "@fortawesome/free-solid-svg-icons"

interface TaskBoardHeaderProps {onAddTask: () => void}

export default function TaskBoardHeader({onAddTask}: TaskBoardHeaderProps) {
    return (
        <div className={"d-flex justify-content-between align-items-center mb-4"}>
            <div className={"d-flex align-items-center gap-2"}>
                <h3 className={"mb-0"}>Task Board</h3>

                <OverlayTrigger
                    placement={"bottom"}
                    trigger={["hover", "focus"]}
                    overlay={
                        <Tooltip id={"task-board-tooltip"}>
                            Drag and drop tasks between columns to change their status.
                        </Tooltip>
                    }
                >
                    <Button
                        variant={"link"}
                        className={"p-0 text-secondary border-0"}
                        aria-label={"How to change task status"}
                    >
                        <FontAwesomeIcon icon={faCircleInfo} size={"lg"}/>
                    </Button>
                </OverlayTrigger>
            </div>

            <Button variant={"primary"} onClick={onAddTask}>
                <FontAwesomeIcon icon={faPlus} className={"me-2"}/>
                Add Task
            </Button>
        </div>
    )
}

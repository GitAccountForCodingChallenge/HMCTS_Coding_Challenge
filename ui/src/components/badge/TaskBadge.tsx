import type {ReactNode} from "react"
import {Badge} from "react-bootstrap"

interface TaskBadgeProps {
    colour: string
    children: ReactNode
    square?: boolean
}

export default function TaskBadge({colour, children, square = false}: TaskBadgeProps) {
    return (
        <Badge
            bg={colour}
            text={colour === "warning" ? "dark" : "light"}
            className={
                square
                    ? "d-inline-flex align-items-center justify-content-center rounded-3 fs-6 flex-shrink-0"
                    : "d-inline-flex align-items-center justify-content-center rounded-3 px-2 py-2 flex-shrink-0"
            }
            style={square ? { width: 36, height: 36 } : undefined}
        >
            {children}
        </Badge>
    );
}

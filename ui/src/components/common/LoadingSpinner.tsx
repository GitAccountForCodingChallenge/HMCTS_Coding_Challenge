import {Spinner} from "react-bootstrap"

interface LoadingSpinnerProps {
    text?: string
    size?: "sm"
    variant?: string
    centered?: boolean
}

export default function LoadingSpinner({text, size, variant, centered = false}: LoadingSpinnerProps) {
    const spinner = (
        <span
            className={"d-inline-flex align-items-center gap-2"}
            role={"status"}
        >
      <Spinner animation={"border"} size={size} variant={variant} aria-hidden={"true"}/>
            {text && <span>{text}</span>}
            <span className={"visually-hidden"}>
        {text ? text : "Loading..."}
      </span>
    </span>
    )

    if (centered) {
        return (
            <div className={"d-flex justify-content-center align-items-center py-5"}>
                {spinner}
            </div>
        )
    }

    return spinner
}

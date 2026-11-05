import type {ReactNode} from "react"
import {Alert} from "react-bootstrap"

type AlertVariant =
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "primary"
    | "secondary"

interface CustomAlertProps {
    variant?: AlertVariant
    title?: string
    children: ReactNode
    dismissible?: boolean
    onClose?: () => void
}

export default function CustomAlert({
                                        variant = "danger",
                                        title,
                                        children,
                                        dismissible = false,
                                        onClose,
                                    }: CustomAlertProps) {
    return (
        <Alert
            variant={variant}
            dismissible={dismissible}
            onClose={onClose}
            className={"mb-3"}
        >
            {title && (
                <Alert.Heading>{title}</Alert.Heading>
            )}

            {children}
        </Alert>
    );
}

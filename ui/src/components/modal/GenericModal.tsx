import type {ReactNode} from "react"
import {Modal} from "react-bootstrap"

interface GenericModalProps {
    title: string
    show: boolean
    onHideCallback: () => void
    children: ReactNode
    footer?: ReactNode
    isSubmitting?: boolean
}

export default function GenericModal({
                                         title,
                                         show,
                                         onHideCallback,
                                         children,
                                         footer,
                                         isSubmitting = false
                                     }: GenericModalProps) {
    return <Modal show={show} onHide={onHideCallback} centered backdrop={isSubmitting ? "static" : true} keyboard={!isSubmitting}>
        <Modal.Header closeButton={!isSubmitting}>
            <Modal.Title>
                <h4>{title}</h4>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
        {footer && (
            <Modal.Footer>
                {footer}
            </Modal.Footer>
        )}
    </Modal>
}
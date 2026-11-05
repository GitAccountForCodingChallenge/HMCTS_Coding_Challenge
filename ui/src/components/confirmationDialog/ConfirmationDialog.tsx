import {Button} from "react-bootstrap"
import GenericModal from "../modal/GenericModal"
import LoadingSpinner from "../common/LoadingSpinner"

interface ConfirmationDialogProps {
    show: boolean
    onHideCallback: () => void
    onConfirmCallback: () => void
    title: string
    text: string
    isSubmitting?: boolean
    confirmVariant?: "primary" | "danger"
    confirmText?: string
    loadingText?: string
}

export default function ConfirmationDialog({
                                               show,
                                               onHideCallback,
                                               onConfirmCallback,
                                               title,
                                               text,
                                               isSubmitting = false,
                                               confirmVariant = "primary",
                                               confirmText = "Confirm",
                                               loadingText = "Processing..."
                                           }: ConfirmationDialogProps) {

    const modalFooter = () => (
        <>
            <Button variant={"secondary"} onClick={onHideCallback}>Cancel</Button>
            <Button variant={confirmVariant} onClick={onConfirmCallback} disabled={isSubmitting}>
                {isSubmitting ? (
                    <LoadingSpinner text={loadingText} size={"sm"} />
                ) : (
                    confirmText
                )}
            </Button>
        </>
    )

    const modalBody = () => (
        <p className={"text-center mb-0 text-break"}>
            {text}
        </p>
    )

    return (
        <GenericModal
            title={title}
            show={show}
            onHideCallback={onHideCallback}
            footer={modalFooter()}
        >
            {modalBody()}
        </GenericModal>
    )

}
import {Button} from "react-bootstrap"
import {useFormikContext} from "formik"
import type {CreateTaskFormValues} from "./CreateTaskForm"
import LoadingSpinner from "../../common/LoadingSpinner"

interface CreateTaskModalFooterProps {
    onCancel: () => void
    formId: string
}

export default function CreateTaskModalFooter({onCancel, formId}: CreateTaskModalFooterProps) {
    const { isSubmitting } = useFormikContext<CreateTaskFormValues>()

    return (
        <>
            <Button variant={"secondary"} onClick={onCancel} disabled={isSubmitting}>
                Cancel
            </Button>

            <Button variant={"primary"} type={"submit"} form={formId} disabled={isSubmitting}>
                {isSubmitting ? (
                    <LoadingSpinner text={"Creating..."} size={"sm"} />
                ) : (
                    "Create Task"
                )}
            </Button>
        </>
    )
}

import {useId} from "react"
import {FormikProvider, useFormik} from "formik"
import {Form} from "react-bootstrap"
import GenericModal from "../GenericModal"
import type {CreateTaskFormValues} from "./CreateTaskForm"
import CreateTaskForm from "./CreateTaskForm"
import CreateTaskModalFooter from "./CreateTaskModalFooter"
import {taskValidationSchema} from "./taskValidationSchema"
import {TaskPostBody, useCreateTaskMutation,} from "../../../services/generated/tasksApi"
import {customToast} from "../../../utils/customToast"

interface CreateTaskModalProps {
    show: boolean
    onHide: () => void
}

const initialValues: CreateTaskFormValues = {
    title: "",
    description: "",
    status: "PENDING",
    dueDate: ""
}

export default function CreateTaskModal({show, onHide,}: CreateTaskModalProps) {
    const formId = useId()

    const [createTask] = useCreateTaskMutation()

    const formik = useFormik<CreateTaskFormValues>({
        initialValues,
        validationSchema: taskValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await createTask({taskPostBody: mapFormToTask(values),}).unwrap()
                customToast.success.created("Task")
                resetForm()
                onHide()
            } catch {
                customToast.error("Failed to create task.")
            }
        }
    })

    const mapFormToTask = (values: CreateTaskFormValues): TaskPostBody => ({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
        dueDate: new Date(values.dueDate).toISOString()
    })

    const handleClose = () => {
        if (formik.isSubmitting) {
            return
        }

        formik.resetForm()
        onHide()
    }

    return (
        <FormikProvider value={formik}>
            <GenericModal
                title={"Create Task"}
                show={show}
                onHideCallback={handleClose}
                isSubmitting={formik.isSubmitting}
                footer={
                    <CreateTaskModalFooter
                        onCancel={handleClose}
                        formId={formId}
                    />
                }
            >
                <Form id={formId} noValidate onSubmit={formik.handleSubmit}>
                    <CreateTaskForm />
                </Form>
            </GenericModal>
        </FormikProvider>
    )
}

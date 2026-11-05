import {useFormikContext} from "formik"
import {Form} from "react-bootstrap"
import type {TaskPostBody} from "../../../services/generated/tasksApi"
import {columns} from "../../board/taskColumns"
import {taskValidationConfig} from "./taskValidationSchema"

export interface CreateTaskFormValues {
    title: string
    description: string
    status: TaskPostBody["status"]
    dueDate: string
}

export default function CreateTaskForm() {
    const formik = useFormikContext<CreateTaskFormValues>()

    return (
        <>
            <Form.Group className={"mb-3"} controlId={"taskTitle"}>
                <Form.Label>Task Title *</Form.Label>

                <Form.Control
                    type={"text"}
                    name={"title"}
                    placeholder={"Enter task title"}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.touched.title && !!formik.errors.title}
                    maxLength={taskValidationConfig.title.maxLength}
                />

                <Form.Control.Feedback type={"invalid"}>
                    {formik.errors.title}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"taskDescription"}>
                <Form.Label>Description</Form.Label>

                <Form.Control
                    as={"textarea"}
                    rows={3}
                    name={"description"}
                    maxLength={taskValidationConfig.description.maxLength}
                    placeholder={"Enter a description (optional)"}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.touched.description && !!formik.errors.description}
                />

                <Form.Control.Feedback type={"invalid"}>
                    {formik.errors.description}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"taskStatus"}>
                <Form.Label>Status *</Form.Label>

                <Form.Select
                    name={"status"}
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.touched.status && !!formik.errors.status}
                >
                    {columns.map((column) => (
                        <option key={column.id} value={column.id}>
                            {column.title}
                        </option>
                    ))}
                </Form.Select>

                <Form.Control.Feedback type={"invalid"}>
                    {formik.errors.status}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"taskDueDate"}>
                <Form.Label>Due Date *</Form.Label>

                <Form.Control
                    type={"datetime-local"}
                    name={"dueDate"}
                    value={formik.values.dueDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.touched.dueDate && !!formik.errors.dueDate}
                />

                <Form.Control.Feedback type={"invalid"}>
                    {formik.errors.dueDate}
                </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}

import {Form} from "react-bootstrap"

type TaskSearchBarProps = {
    value: string
    onChange: (value: string) => void
}

export default function TaskSearchBar({value, onChange}: TaskSearchBarProps) {
    return (
        <Form.Group controlId={"taskSearch"} className={"mb-4"}>
            <Form.Label>Search tasks</Form.Label>

            <Form.Control
                type={"search"}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={"Search by task title..."}
                autoComplete={"off"}
            />

            <Form.Text className={"text-muted"}>
                Enter at least 3 characters to search.
            </Form.Text>
        </Form.Group>
    )
}
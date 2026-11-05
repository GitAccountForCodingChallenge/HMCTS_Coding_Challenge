import {useMemo, useState} from "react"
import {Col, Row} from "react-bootstrap"
import {useGetTaskByIdQuery, useGetTaskSummariesQuery,} from "../services/generated/tasksApi"
import {useDebouncedValue} from "../hooks/useDebouncedValue"
import TaskSearchBar from "../components/search/TaskSearchBar"
import TaskSearchResults from "../components/search/TaskSearchResults"
import TaskDetailsCard from "../components/search/TaskDetailsCard"
import CustomAlert from "../components/common/CustomAlert"
import LoadingSpinner from "../components/common/LoadingSpinner"

const MIN_SEARCH_LENGTH = 3
const DEBOUNCE_DELAY = 300

export default function SearchPage() {
    const [search, setSearch] = useState("")
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

    const debouncedSearch = useDebouncedValue(search, DEBOUNCE_DELAY)

    const searchTerm = search.trim()
    const debouncedTerm = debouncedSearch.trim()

    const hasMinimumLength = searchTerm.length >= MIN_SEARCH_LENGTH

    const isDebouncing = search !== debouncedSearch

    const shouldSearch = hasMinimumLength && !isDebouncing

    const {
        data: summaries = [],
        isLoading: isLoadingSummaries,
        isFetching: isFetchingSummaries,
        isError: isSummariesError
    } = useGetTaskSummariesQuery(undefined, {
        skip: !shouldSearch
    })

    const {
        currentData: selectedTask,
        isFetching: isFetchingTask,
        isError: isTaskError
    } = useGetTaskByIdQuery(
        { taskId: selectedTaskId ?? 0 },
        { skip: selectedTaskId === null }
    )

    const filteredTasks = useMemo(() => {
        if (!shouldSearch) {
            return []
        }

        return summaries.filter((task) =>
            task.title
                .toLowerCase()
                .includes(debouncedTerm.toLowerCase())
        )
    }, [summaries, debouncedTerm, shouldSearch])

    const handleSearchChange = (value: string) => {
        setSearch(value)
        setSelectedTaskId(null)
    }

    const renderSearchContent = () => {
        if (searchTerm.length === 0) {
            return (
                <p className={"text-muted"}>
                    Search for a task to view its details.
                </p>
            )
        }

        if (!hasMinimumLength) {
            return (
                <p className={"text-muted"}>
                    Enter at least 3 characters to search.
                </p>
            )
        }

        if (isDebouncing) {
            return (
                <p className={"text-muted"} role={"status"}>
                    Searching...
                </p>
            )
        }

        return (
            <Row className={"g-4"}>
                <Col md={5}>
                    <TaskSearchResults
                        tasks={filteredTasks}
                        selectedTaskId={selectedTaskId}
                        isLoading={isLoadingSummaries || isFetchingSummaries}
                        isError={isSummariesError}
                        onSelect={setSelectedTaskId}
                    />
                </Col>

                <Col md={7}>
                    {selectedTaskId !== null && (
                        <>
                            {isFetchingTask && <LoadingSpinner />}

                            {isTaskError && (
                                <CustomAlert variant="danger" title="Unable to load task">
                                    Something went wrong while retrieving the task details.
                                    Please try again.
                                </CustomAlert>
                            )}

                            {!isFetchingTask && !isTaskError && selectedTask && (
                                <TaskDetailsCard task={selectedTask} />
                            )}
                        </>
                    )}
                </Col>
            </Row>
        )
    }

    return (
        <div className={"container py-4"}>
            <h1 className={"h3 mb-2"}>Search Tasks</h1>

            <p className={"text-muted mb-4"}>
                Find a task by title and view its details.
            </p>

            <TaskSearchBar value={search} onChange={handleSearchChange}/>

            {renderSearchContent()}
        </div>
    )
}

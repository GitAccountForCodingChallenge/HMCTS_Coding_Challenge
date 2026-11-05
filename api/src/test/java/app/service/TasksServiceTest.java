package app.service;

import app.model.TaskEntity;
import app.repository.TaskRepository;
import dev.codingchallenge.model.Task;
import dev.codingchallenge.model.TaskPatchBody;
import dev.codingchallenge.model.TaskPostBody;
import dev.codingchallenge.model.TaskSummary;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TasksServiceTest {

    @Mock
    private TaskRepository mockTaskRepository;

    private TasksService tasksService;

    @BeforeEach
    void setUp() {
        tasksService = new TasksService(mockTaskRepository);
    }

    private TaskEntity createEntity() {
        return new TaskEntity(
                1,
                "Write unit tests",
                "Test the service",
                "PENDING",
                LocalDateTime.of(2026, 12, 25, 12, 0),
                false
        );
    }

    @Test
    void shouldReturnAllTasks() {
        when(mockTaskRepository.findAll()).thenReturn(List.of(createEntity()));

        List<Task> tasks = tasksService.findAllTasks();

        assertEquals(1, tasks.size());
        assertEquals(1, tasks.getFirst().getTaskId());
        assertEquals("Write unit tests", tasks.getFirst().getTitle());
        assertEquals(Task.StatusEnum.PENDING, tasks.getFirst().getStatus());

        verify(mockTaskRepository).findAll();
    }

    @Test
    void shouldReturnTaskById() {
        when(mockTaskRepository.findById(1)).thenReturn(Optional.of(createEntity()));

        Task task = tasksService.findSingleTask(1);

        assertEquals(1, task.getTaskId());
        assertEquals("Write unit tests", task.getTitle());
        assertEquals("Test the service", task.getDescription());
    }

    @Test
    void shouldThrowWhenTaskDoesNotExist() {
        when(mockTaskRepository.findById(99)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> tasksService.findSingleTask(99)
        );

        assertEquals("No task found with the given Id.", exception.getMessage());
    }

    @Test
    void shouldSoftDeleteTask() {
        TaskEntity entity = createEntity();

        when(mockTaskRepository.findById(1)).thenReturn(Optional.of(entity));

        tasksService.softDeleteTask(1);

        assertTrue(entity.isDeleted());

        verify(mockTaskRepository).save(entity);
    }

    @Test
    void shouldUpdateTaskStatus() {
        TaskEntity entity = createEntity();
        TaskPatchBody body = new TaskPatchBody();
        body.setStatus(TaskPatchBody.StatusEnum.COMPLETED);

        when(mockTaskRepository.findById(1)).thenReturn(Optional.of(entity));

        when(mockTaskRepository.save(entity)).thenReturn(entity);

        Task updatedTask = tasksService.updateTaskStatus(1, body);

        assertEquals("COMPLETED", entity.getStatus());
        assertEquals(Task.StatusEnum.COMPLETED, updatedTask.getStatus());

        verify(mockTaskRepository).save(entity);
    }

    @Test
    void shouldCreateTask() {
        TaskPostBody body = new TaskPostBody();
        body.setTitle("New task");
        body.setDescription("New description");
        body.setStatus(TaskPostBody.StatusEnum.PENDING);
        body.setDueDate(OffsetDateTime.parse("2027-01-01T12:00:00Z"));

        when(mockTaskRepository.save(any(TaskEntity.class)))
                .thenAnswer(invocation -> {
                    TaskEntity entity = invocation.getArgument(0);
                    entity.setTaskId(10);
                    return entity;
                });

        Task createdTask = tasksService.createTask(body);

        ArgumentCaptor<TaskEntity> captor = ArgumentCaptor.forClass(TaskEntity.class);

        verify(mockTaskRepository).save(captor.capture());

        TaskEntity savedEntity = captor.getValue();

        assertEquals("New task", savedEntity.getTitle());
        assertEquals("New description", savedEntity.getDescription());
        assertEquals("PENDING", savedEntity.getStatus());
        assertFalse(savedEntity.isDeleted());

        assertEquals(10, createdTask.getTaskId());
        assertEquals("New task", createdTask.getTitle());
    }


    @Test
    void shouldConvertIncomingDueDateToUtc() {
        TaskPostBody body = new TaskPostBody();
        body.setTitle("Timezone task");
        body.setStatus(TaskPostBody.StatusEnum.PENDING);
        body.setDueDate(OffsetDateTime.parse("2027-01-01T15:00:00+02:00"));

        when(mockTaskRepository.save(any(TaskEntity.class)))
                .thenAnswer(invocation -> {
                    TaskEntity entity = invocation.getArgument(0);
                    entity.setTaskId(11);
                    return entity;
                });

        Task created = tasksService.createTask(body);

        assertEquals(OffsetDateTime.parse("2027-01-01T13:00:00Z"), created.getDueDate());
    }

    @Test
    void shouldReturnTaskSummaries() {
        TaskEntity firstTask = new TaskEntity();
        firstTask.setTaskId(1);
        firstTask.setTitle("Finish Coding Challenge");

        TaskEntity secondTask = new TaskEntity();
        secondTask.setTaskId(2);
        secondTask.setTitle("Review Best Practices");

        when(mockTaskRepository.findAll())
                .thenReturn(List.of(firstTask, secondTask));

        List<TaskSummary> result = tasksService.findTaskSummaries();

        assertEquals(2, result.size());

        assertEquals(1, result.get(0).getTaskId());
        assertEquals("Finish Coding Challenge", result.get(0).getTitle());

        assertEquals(2, result.get(1).getTaskId());
        assertEquals("Review Best Practices", result.get(1).getTitle());

        verify(mockTaskRepository).findAll();
    }

    @Test
    void shouldReturnEmptyTaskSummariesWhenNoTasksExist() {
        when(mockTaskRepository.findAll()).thenReturn(List.of());

        List<TaskSummary> result = tasksService.findTaskSummaries();

        assertTrue(result.isEmpty());
        verify(mockTaskRepository).findAll();
    }
}

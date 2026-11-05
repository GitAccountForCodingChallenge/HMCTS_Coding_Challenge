package app.repository;

import app.model.TaskEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TaskRepositoryIntegrationTest {

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void shouldLoadTasksFromDataSql() {
        List<TaskEntity> tasks = taskRepository.findAll();

        assertEquals(3, tasks.size());
        assertTrue(tasks.stream().anyMatch(task -> task.getTitle().equals("Finish Coding Challenge")));
        assertTrue(tasks.stream().anyMatch(task -> task.getTitle().equals("Review Best Practices")));
        assertTrue(tasks.stream().anyMatch(task -> task.getTitle().equals("Book Christmas Party")));
    }

    @Test
    void shouldLoadTaskStatusesCorrectly() {
        List<TaskEntity> tasks = taskRepository.findAll();

        assertTrue(tasks.stream().anyMatch(task -> task.getStatus().equals("IN PROGRESS")));
        assertTrue(tasks.stream().anyMatch(task -> task.getStatus().equals("PENDING")));
        assertTrue(tasks.stream().anyMatch(task -> task.getStatus().equals("COMPLETED")));
    }
}
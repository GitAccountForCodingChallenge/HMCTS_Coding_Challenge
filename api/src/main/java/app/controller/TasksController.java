package app.controller;


import app.service.TasksService;
import dev.codingchallenge.api.TasksApi;
import dev.codingchallenge.model.Task;
import dev.codingchallenge.model.TaskPatchBody;
import dev.codingchallenge.model.TaskPostBody;
import dev.codingchallenge.model.TaskSummary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TasksController implements TasksApi {

    private final TasksService tasksService;

    public TasksController(TasksService tasksService) {
        this.tasksService = tasksService;
    }

    @Override
    public ResponseEntity<Task> createTask(TaskPostBody taskPostBody) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tasksService.createTask(taskPostBody));
    }

    @Override
    public ResponseEntity<Task> getTaskById(Integer taskId) {
        return ResponseEntity.ok(tasksService.findSingleTask(taskId));
    }

    @Override
    public ResponseEntity<List<Task>> getTasks() {
        return ResponseEntity.ok(tasksService.findAllTasks());
    }

    @Override
    public ResponseEntity<Void> deleteTaskById(Integer taskId) {
        tasksService.softDeleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Task> updateTaskById(Integer taskId, TaskPatchBody taskPatchBody) {
        return ResponseEntity.ok(tasksService.updateTaskStatus(taskId, taskPatchBody));
    }

    @Override
    public ResponseEntity<List<TaskSummary>> getTaskSummaries() {
        return ResponseEntity.ok(tasksService.findTaskSummaries());
    }
}

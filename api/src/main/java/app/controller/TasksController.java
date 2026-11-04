package app.controller;


import app.service.TasksService;
import dev.codingchallenge.api.TasksApi;
import dev.codingchallenge.model.Task;
import dev.codingchallenge.model.TaskPatchBody;
import dev.codingchallenge.model.TaskPostBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TasksController implements TasksApi {

    @Autowired
    private TasksService tasksService;

    @Override
    public ResponseEntity<Task> createTask(TaskPostBody taskPostBody) {
        return ResponseEntity.ok(tasksService.createTask(taskPostBody));
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
    public ResponseEntity<Task> updateTaskById(TaskPatchBody taskPatchBody) {
        return ResponseEntity.ok(tasksService.updateTaskStatus(taskPatchBody));
    }
}

package app.service;


import dev.codingchallenge.model.Task;
import dev.codingchallenge.model.TaskPatchBody;
import dev.codingchallenge.model.TaskPostBody;
import jakarta.persistence.EntityNotFoundException;
import app.model.TaskEntity;
import app.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TasksService {

    @Autowired
    private TaskRepository taskRepository;

    public Task createTask(TaskPostBody body){
        TaskEntity newTask = new TaskEntity();
        newTask.setTitle(body.getTitle());
        newTask.setDescription(body.getDescription());
        newTask.setStatus(body.getStatus().toString());
        newTask.setDueDate(body.getDueDate().toLocalDateTime());
        taskRepository.save(newTask);
        return mapEntityToDto(newTask);
    }

    public Task findSingleTask(int taskId){
        TaskEntity task =  getTaskEntity(taskId);
        return mapEntityToDto(task);
    }

    public List<Task> findAllTasks(){
        List<TaskEntity> listOfTasks = taskRepository.findAll();

        return listOfTasks.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public void softDeleteTask(int taskId){
        TaskEntity taskToDelete = getTaskEntity(taskId);
        taskToDelete.setDeleted(true);
        taskRepository.save(taskToDelete);
    }

    public Task updateTaskStatus(TaskPatchBody body){
        TaskEntity taskToUpdate = getTaskEntity(body.getTaskId());
        taskToUpdate.setStatus(body.getStatus().toString());
        return mapEntityToDto(taskToUpdate);
    }

    private TaskEntity getTaskEntity(int taskId){
        return taskRepository.findByTaskId(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with the given Id."));
    }

    private Task mapEntityToDto(TaskEntity entity) {

        Task task = new Task();
        task.setTaskId(entity.getTaskId());
        task.setTitle(entity.getTitle());
        task.setStatus(Task.StatusEnum.fromValue(entity.getStatus()));

        if (entity.getDescription() != null) {
            task.setDescription(entity.getDescription());
        }

        if (entity.getDueDate() != null) {
            task.setDueDate(entity.getDueDate().atOffset(java.time.ZoneOffset.UTC));
        }
        return task;
    }

}

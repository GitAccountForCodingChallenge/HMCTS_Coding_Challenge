package app.service;

import app.model.TaskEntity;
import app.repository.TaskRepository;
import dev.codingchallenge.model.Task;
import dev.codingchallenge.model.TaskPatchBody;
import dev.codingchallenge.model.TaskPostBody;
import dev.codingchallenge.model.TaskSummary;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TasksService {

    private final TaskRepository taskRepository;

    public TasksService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional
    public Task createTask(TaskPostBody body){
        TaskEntity newTask = new TaskEntity();
        newTask.setTitle(body.getTitle());
        newTask.setDescription(body.getDescription());
        newTask.setStatus(body.getStatus().toString());
        newTask.setDueDate(
                body.getDueDate()
                        .withOffsetSameInstant(ZoneOffset.UTC)
                        .toLocalDateTime()
        );

        TaskEntity savedTask = taskRepository.save(newTask);
        return mapEntityToDto(savedTask);
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

    @Transactional
    public void softDeleteTask(int taskId){
        TaskEntity taskToDelete = getTaskEntity(taskId);
        taskToDelete.setDeleted(true);
        taskRepository.save(taskToDelete);
    }

    @Transactional
    public Task updateTaskStatus(Integer taskId, TaskPatchBody body){
        TaskEntity taskToUpdate = getTaskEntity(taskId);
        taskToUpdate.setStatus(body.getStatus().toString());

        TaskEntity savedTask = taskRepository.save(taskToUpdate);

        return mapEntityToDto(savedTask);
    }

    private TaskEntity getTaskEntity(int taskId){
        return taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with the given Id."));
    }

    private Task mapEntityToDto(TaskEntity entity) {

        Task task = new Task();
        task.setTaskId(entity.getTaskId());
        task.setTitle(entity.getTitle());
        task.setStatus(Task.StatusEnum.fromValue(entity.getStatus()));

        if (entity.getDescription() != null) {
            task.setDescription(entity.getDescription());
        }

        task.setDueDate(entity.getDueDate().atOffset(ZoneOffset.UTC));

        return task;
    }

    @Transactional
    public List<TaskSummary> findTaskSummaries() {
        return taskRepository.findAll()
                .stream()
                .map(entity -> {
                    TaskSummary summary = new TaskSummary();
                    summary.setTaskId(entity.getTaskId());
                    summary.setTitle(entity.getTitle());
                    return summary;
                })
                .toList();
    }

}

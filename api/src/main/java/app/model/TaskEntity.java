package app.model;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "task")
@SQLRestriction("deleted = false")
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    private String title;
    private String description;
    private String status;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    private boolean deleted = false;

    public TaskEntity() {}

    public TaskEntity(Integer taskId, String title, String description, String status, LocalDateTime dueDate, boolean deleted) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
        this.deleted = deleted;
    }

    public Integer getTaskId() {
        return taskId;
    }

    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
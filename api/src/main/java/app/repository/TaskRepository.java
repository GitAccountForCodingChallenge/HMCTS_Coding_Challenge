package app.repository;

import app.model.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<TaskEntity, Integer>{

    Optional<TaskEntity> findByTaskId(Integer taskId);

}

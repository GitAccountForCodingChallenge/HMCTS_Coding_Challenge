CREATE TABLE task (
                      task_id INT AUTO_INCREMENT PRIMARY KEY,
                      title VARCHAR(255) NOT NULL,
                      description VARCHAR(500),
                      status VARCHAR(50) NOT NULL,
                      due_date TIMESTAMP NOT NULL,
                      deleted BOOLEAN DEFAULT FALSE NOT NULL);
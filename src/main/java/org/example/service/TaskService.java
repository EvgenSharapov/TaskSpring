package org.example.service;

import org.example.entity.Task;
import org.example.entity.Status;
import org.example.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
//@Qualifier(value = "db")
    public TaskService(@Autowired TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAll(int pageNumber, int pageSize) {
        return taskRepository.getAll(pageNumber, pageSize);
    }

    public Integer getAllCount() {
        return taskRepository.getAllCount();
    }

    public Task createTask(String description, Status status) {
        Task task = new Task();
        task.setStatus(status);
        task.setDescription(description);
        return taskRepository.save(task);
    }

    public Task updateTask(long id, String description, Status status) {
        Task task = taskRepository.findById(id).orElse(null);
        if (isNull(task)) {
            return null;
        }

        boolean needUpdate = false;

        if (!StringUtils.isEmpty(description) && description.length() <= 30) {
            task.setDescription(description);
            needUpdate = true;
        }

        if (nonNull(status)) {
            task.setStatus(status);
            needUpdate = true;
        }

        if (needUpdate) {
            taskRepository.update(task);
        }
        System.out.println(task);
        return task;
    }

    public Task delete(long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (isNull(task)) {
            return null;
        }

        taskRepository.delete(task);
        return task;
    }
}
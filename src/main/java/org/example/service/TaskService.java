package org.example.service;

import org.example.domain.Task;
import org.example.repository.TaskRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    public void saveTask(Task task) {
        taskRepository.save(task);
    }

    public List<Task> getTasksWithPagination(int offset, int limit) {
        Pageable pageable = PageRequest.of(offset, limit);
        return taskRepository.findAll(pageable).getContent();
    }
    @Transactional
    public void updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        taskRepository.save(task);
    }
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }
    public void getAllCount(){
        taskRepository.count();
    }
}
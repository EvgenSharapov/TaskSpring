package org.example.repository;

import org.example.entity.Task;

import java.util.List;
import java.util.Optional;

public interface TaskRepository {
    List<Task> getAll(int pageNumber, int pageSize);

    int getAllCount();

    Task save(Task task);

    Task update(Task task);

    Optional<Task> findById(long id);

    void delete(Task task);
}
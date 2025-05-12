package com.taskmanager.service;

import com.taskmanager.model.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    
    List<Task> getAllTasks();
    
    Optional<Task> getTaskById(Long id);
    
    Task createTask(Task task);
    
    Task updateTask(Long id, Task task);
    
    void deleteTask(Long id);
    
    List<Task> searchTasks(String query);
    
    List<Task> getTasksByCategory(String category);
    
    List<Task> getTasksByPriority(String priority);
    
    List<Task> getTasksByStatus(boolean completed);
} 
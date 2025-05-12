package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByCompleted(boolean completed);
    
    List<Task> findByPriority(String priority);
    
    List<Task> findByCategory(String category);
    
    @Query("SELECT t FROM Task t WHERE " +
           "LOWER(t.text) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.priority) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Task> searchTasks(@Param("query") String query);
} 
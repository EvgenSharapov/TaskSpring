package org.example.controller;

import org.example.domain.Task;
import org.example.service.TaskService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import static java.util.Objects.isNull;

@Controller
@RequestMapping("/")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @GetMapping("/")
    public String viewTasks(Model model,@RequestParam(value = "page", required = false, defaultValue = "1")int page,
                                        @RequestParam(value = "limit", required = false, defaultValue = "10")int limit) {

        model.addAttribute("tasks", taskService.getTasksWithPagination((page-1)*limit,limit));
        return "tasks";
    }

    @PostMapping("/")
    public void addTask(@ModelAttribute Task task) {
        taskService.saveTask(task);

    }

    @PostMapping("/{id}")
    public void editTask(@PathVariable Long id, @ModelAttribute Task task) {
        if(isNull(id)|| id<=0){
            throw new RuntimeException("Invalid id");
        }
        taskService.updateTask(id, task);
    }

    @PostMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        if(isNull(id)|| id<=0){
            throw new RuntimeException("Invalid id");
        }
        taskService.deleteTask(id);
        return "tasks";
    }
}
package org.example.entity;

import jakarta.persistence.*;

@Entity
@Table(name="task",schema = "todo")
@NamedQueries({
        @NamedQuery(name = "task_allCount", query = "SELECT COUNT(p) FROM Task p")})
public class Task {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(nullable=false)
    private Long id;

    @Column(length=45,nullable=false)
    private String description;


    @Enumerated(EnumType.ORDINAL)
    @Column(nullable=false)
    private Status status;



    public Task() {
    }

    public Task(Long id, String description, Status status) {
        this.id = id;
        this.description = description;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }


}
package org.example.repository;

import org.example.entity.Task;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.query.NativeQuery;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import javax.annotation.PreDestroy;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

@Repository(value = "db")
public class TaskRepositoryDB implements TaskRepository {
    private final SessionFactory sessionFactory;

    public TaskRepositoryDB() {
        Properties properties = new Properties();
        properties.put(Environment.DRIVER, "com.mysql.cj.jdbc.Driver");
        properties.put(Environment.URL, "jdbc:mysql://localhost:3305/todo");
        properties.put(Environment.DIALECT, "org.hibernate.dialect.MySQLDialect");
        properties.put(Environment.USER, "root");
        properties.put(Environment.PASS, "root");
        properties.put(Environment.HBM2DDL_AUTO, "update");

        sessionFactory = new Configuration()
                .addAnnotatedClass(Task.class)
                .addProperties(properties)
                .buildSessionFactory();
    }

    @Override
    public List<Task> getAll(int pageNumber, int pageSize) {
        try (Session session = sessionFactory.openSession()) {
            NativeQuery<Task> query = session.createNativeQuery("SELECT * FROM todo.task", Task.class);
            query.setFirstResult(pageSize * pageNumber);
            query.setMaxResults(pageSize);
            return query.list();
        }catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка получения задачи", e);
        }
    }

    @Override
    public int getAllCount() {
        try (Session session = sessionFactory.openSession()) {
            Query<Long>query= session.createNamedQuery("task_allCount",Long.class);
            if(query.uniqueResult()!=null){
                return Math.toIntExact(query.uniqueResult());}
            else return 0;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка получения количества задач", e);}
    }


    @Override
    public Task save(Task task) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction=session.beginTransaction();
            session.save(task);
            transaction.commit();
            return task;
        }catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка сохранения задачи", e);
        }
    }

    @Override
    public Task update(Task task) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction=session.beginTransaction();
            session.update(task);
            transaction.commit();
            return task;
        }catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка обновления задачи", e);
        }
    }

    @Override
    public Optional<Task> findById(long id) {
        try (Session session = sessionFactory.openSession()) {
            Task task=session.find(Task.class,id);
            return Optional.ofNullable(task);}
        catch (Exception e) {
            e.printStackTrace();
            return Optional.empty(); }
    }

    @Override
    public void delete(Task task) {
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction=session.beginTransaction();
            session.remove(task);
            transaction.commit();
        }catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка удаления задачи", e);
        }

    }

    @PreDestroy
    public void beforeStop() {
        sessionFactory.close();

    }
}
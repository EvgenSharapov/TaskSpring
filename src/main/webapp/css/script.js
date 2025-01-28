let currentPage = 0;
const pageSize = 3;

function loadTask(pageNumber) {
    currentPage = pageNumber;
    $.get(`/rest/tasks?pageNumber=${pageNumber}&pageSize=${pageSize}`, function (task) {
        $('#taskTable tbody').empty();
        task.forEach(task => {
            $('#taskTable tbody').append(`
                <tr>
                    <td>${task.id}</td>
                    <td>${task.description}</td>
                    <td>${task.status}</td>
                    <td>
                       <td>
                        <button onclick="editTask(${task.id})">Edit</button>
                         <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                     </td>
                    </td>
                </tr>
            `);
        });
        updatePagination();
    });
}

function updatePagination() {
    $.get('/rest/tasks/count', function (totalCount) {
        const totalPages = Math.ceil(totalCount / pageSize);
        $('#pagination').empty();
        for (let i = 0; i < totalPages; i++) {
            $('#pagination').append(`<button onclick="loadTask(${i})">${i + 1}</button>`);
        }
    });
}

function addTask() {
    let description = $("#description").val();
    let status = $("#status").val();

    $.ajax({
        url: "/rest/tasks",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({ "description": description, "status": status }),
        success: function () {
            $("#description").val("");
            $("#status").val("");
            loadTask(currentPage); // Обновляем таблицу после добавления задачи
        }
    });
    return false;
}

function editTask(id) {
    const description = prompt("Enter new description:");
    let status;
    while (true) {
        status = prompt("Enter new status (DONE, IN_PROGRESS, PAUSED):").toUpperCase();
        if (["DONE", "IN_PROGRESS", "PAUSED"].includes(status)) {
            break;
        } else {
            alert("Invalid status! Please enter one of: DONE, IN_PROGRESS, PAUSED.");
        }
    }

    if (description && status) {
        $.ajax({
            url: `/rest/tasks/${id}`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ description, status }),
            success: function () {
                loadTask(currentPage);
            }
        });
    }
}

function deleteTask(id) {
    if (confirm("Delete task?")) {
        $.ajax({
            url: `/rest/tasks/${id}`,
            type: 'DELETE',
            success: function () {
                loadTask(currentPage);
            }
        });
    }
}

// Инициализация
$(document).ready(function () {
    loadTask(0);
});
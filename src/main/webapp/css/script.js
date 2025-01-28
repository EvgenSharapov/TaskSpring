let currentPage = 0;
let pageSize = 5;


function loadTask(pageNumber) {
    currentPage = pageNumber;
    pageSize = parseInt($('#rowsPerPage').val()); // Получаем выбранное значение
    $.get(`/rest/tasks?pageNumber=${pageNumber}&pageSize=${pageSize}`, function (task) {
        $('#taskTable tbody').empty();
        task.forEach(task => {
            $('#taskTable tbody').append(`
                <tr>
                    <td>${task.id}</td>
                    <td>${task.description}</td>
                    <td>${task.status}</td>
                    <td>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                </td>
                </tr>
            `);
        });
        updatePagination();
    });
}




function showList1(page_number) {
    let url = "/rest/tasks?";

    let countPerPage = $("#rowsPerPage").val();
    if (countPerPage === null) {
        countPerPage = 5;
    }
    url = url.concat("pageSize=").concat(countPerPage);

    if (page_number !== null) {
        url = url.concat("&pageNumber=").concat(page_number);
    }

    $.get(url, function (response) {
        // remove all existing rows
        $("tr:has(td)").remove();

        //arr accounts data
        $.each(response, function (i, item) {
            $('<tr>').html("<td>"
                + item.id + "</td><td>"
                + item.description + "</td><td>"
                + item.status + "</td><td>"
                + "<button id='button_edit_" + item.id + "' onclick='editAcc(" + item.id + ")'>"
                + "</button>" + "</td><td>"
                + "<button id='button_delete_" + item.id + "' onclick='deleteAcc(" + item.id + ")'>"
                + "</button>" + "</td>")
                .appendTo('#taskTable');
        });
    });

    let totalCount = getTotalCount();
    let pagesCount = Math.ceil(totalCount / countPerPage);

    // remove all existing paging buttons
    $("button.pgn-bnt-styled").remove();

    //add paging buttons
    for (let i = 0; i < pagesCount; i++) {
        let button_tag = "<button>" + (i + 1) + ("</button>");
        let btn = $(button_tag)
            .attr('id', "paging_button_" + i)
            .attr('onclick', "showList(" + i + ")")
            .addClass('pgn-bnt-styled');
        $('#paging_buttons').append(btn);
    }

    // mak current page
    if (page_number !== null) {
        let identifier = "#paging_button_" + page_number;
        $(identifier).css("color", "red").css("font-weight", "bold");
    } else {
        $("#paging_button_0").css("color", "red").css("font-weight", "bold");
    }
}









function updatePagination() {
    $.get('/rest/tasks/count', function (totalCount) {
        const totalPages = Math.ceil(totalCount / pageSize);
        $('#pagination').empty();
        for (let i = 0; i < totalPages; i++) {
            $('#pagination').append(`<button onclick="showList(${i})">${i + 1}</button>`);
        }
    });
}

function addTask1() {
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
            showList(currentPage); // Обновляем таблицу после добавления задачи
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
                showList(currentPage);
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
                showList(currentPage);
            }
        });
    }
}

// Инициализация
$(document).ready(function () {
    showList(0);
});
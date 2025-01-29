let page_number = 0;
let pageSize = 5;


function showList(page_number) {
    let url = "/rest/tasks?";

    let countPerPage = $("#rowsPerPage").val();
    if (countPerPage === null) {
        countPerPage = 6;
    }
    url = url.concat("pageSize=").concat(countPerPage);

    if (page_number !== null) {
        url = url.concat("&pageNumber=").concat(page_number);
    }

    $.get(url, function (response) {
        $("tr:has(td)").remove(); // Очистка таблицы перед добавлением новых данных

        $.each(response, function (i, item) {
            $('<tr>').html("<td>"
                + item.id + "</td><td>"
                + item.description + "</td><td>"
                + item.status + "</td><td>"
                + "<button class='edit-btn' id='button_edit_" + item.id + "' onclick='editAcc(" + item.id + ")'>"
                + "</button>"
                + "<button class='delete-btn' id='button_delete_" + item.id + "' onclick='deleteAcc(" + item.id + ")'>"
                + "</button>" + "</td>")
                .appendTo('#taskTable');
        });
    });

    // Получение общего количества задач для пагинации
    let totalCount = getTotalCount();
    let pagesCount = Math.ceil(totalCount / countPerPage);

    // Очистка старых кнопок пагинации
    $("#paging_buttons").empty();

    // Добавление кнопок пагинации
    for (let i = 0; i < pagesCount; i++) {
        let button_tag = "<button>" + (i + 1) + "</button>";
        let btn = $(button_tag)
            .attr('id', "paging_button_" + i)
            .attr('onclick', "showList(" + i + ")")
            .addClass('pgn-bnt-styled');
        $("#paging_buttons").append(btn);
    }

    // Выделение текущей страницы
    if (page_number !== null) {
        let identifier = "#paging_button_" + page_number;
        $(identifier).css("color", "red").css("font-weight", "bold");
    } else {
        $("#paging_button_0").css("color", "red").css("font-weight", "bold");
    }
}

function getTotalCount() {
    let value = 1;
    $.ajax({
        url: "/rest/tasks/count",
        async: false,
        success: function (result) {
            value = result;
        }
    });
    return parseInt(value);
}


function deleteAcc(id) {
    let url = "/rest/tasks/" + id;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            showList(getCurrentPage());
        }
    });
}

function editAcc(id) {
    let identifier_edit = "#button_edit_" + id;
    let identifier_delete = "#button_delete_" + id;

    $(identifier_delete).remove();

    let current_tr_element = $(identifier_edit).closest('tr');

    let save_button_tag = "<button class='save-btn' onclick='saveAcc(" + id + ")'></button>";
    $(identifier_edit).replaceWith(save_button_tag);

    let children = current_tr_element.children();

    let td_name = children[1];
    td_name.innerHTML = "<input id='input_name_" + id + "' type='text' value='" + td_name.innerHTML.trim() + "'>";

    let td_status = children[2];
    let status_current_value = td_status.innerHTML.trim();
    td_status.innerHTML = getStatusHtml(id);
    $("#select_status_" + id).val(status_current_value).change();

}

function saveAcc(id) {
    let value_name = $("#input_name_" + id).val();
    let value_race = $("#select_status_" + id).val();

    let url = "/rest/tasks/" + id;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({"description": value_name, "status": value_race}),
        success: function () {
            showList(getCurrentPage());
        }
    });
}



function getCurrentPage() {
    let current_page = 1;
    $("button:parent(div)").each(function () {
        if ($(this).css("color") === "rgb(255, 0, 0)") {
            current_page = $(this).text();
        }
    })

    return parseInt(current_page) - 1;
}

function getStatusHtml(id) {
    let status_id = "select_status_" + id;
    return "<label for='status'></label>"
        + "<select id=" + status_id + " name='status' class='status-select'>"
        + "<option value='DONE'>DONE</option>"
        + "<option value='PAUSED'>PAUSED</option>"
        + "<option value='IN_PROGRESS'>IN_PROGRESS</option>"
        + "</select>";

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
            showList(getCurrentPage()); // Обновление списка и пагинации
        }
    });
    return false;
}




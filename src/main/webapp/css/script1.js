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
        // remove all existing rows
        $("tr:has(td)").remove();

        //arr accounts data
        $.each(response, function (i, item) {
            $('<tr>').html("<td>"
                + item.id + "</td><td>"
                + item.description + "</td><td>"
                + item.status + "</td><td>"
                + "<button class='edit-btn' id='button_edit_" + item.id + "' onclick='editAcc(" + item.id + ")'>"
                // + "<img src='/img/edit.png' class='img_edit'>"
                + "</button>"
                + "<button class='delete-btn' id='button_delete_" + item.id + "' onclick='deleteAcc(" + item.id + ")'>"
                // + "<img src='/img/delete.png' class='img_delete'>"
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

    // Удаляем кнопку "Delete"
    $(identifier_delete).remove();

    // Сохраняем ссылку на родительский элемент (строку таблицы) до замены кнопки
    let current_tr_element = $(identifier_edit).closest('tr');

    // Заменяем кнопку "Edit" на кнопку "Save"
    let save_button_tag = "<button class='save-btn' onclick='saveAcc(" + id + ")'></button>";
    $(identifier_edit).replaceWith(save_button_tag);

    // Получаем дочерние элементы строки таблицы
    let children = current_tr_element.children();

    // Заменяем содержимое ячейки с именем на текстовое поле
    let td_name = children[1];
    td_name.innerHTML = "<input id='input_name_" + id + "' type='text' value='" + td_name.innerHTML.trim() + "'>";

    // Заменяем содержимое ячейки с расой на выпадающий список
    let td_race = children[2];
    let race_current_value = td_race.innerHTML.trim();
    td_race.innerHTML = getDropdownRaceHtml(id);
    $("#select_race_" + id).val(race_current_value).change();

}

function saveAcc(id) {
    let value_name = $("#input_name_" + id).val();
    let value_race = $("#select_race_" + id).val();

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

function createAcc() {
    let value_name = $("#input_name_new").val();
    let value_title = $("#input_title_new").val();
    let value_race = $("#input_race_new").val();
    let value_profession = $("#input_profession_new").val();
    let value_level = $("#input_level_new").val();
    let value_birthday = $("#input_birthday_new").val();
    let datetime = new Date(value_birthday).getTime();
    let value_banned = $("#input_banned_new").val();

    let current_page = window.location.href;
    console.log(current_page);

    let url = "/rest/players";
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({"name": value_name, "title": value_title, "race": value_race, "profession": value_profession, "level": value_level, "birthday": datetime, "banned": value_banned}),
        success: function () {
            $("#input_name_new").val("");
            $("#input_title_new").val("");
            $("#input_race_new").val();
            $("#input_profession_new").val();
            $("#input_level_new").val("");
            $("#input_birthday_new").val("");
            $("#input_banned_new").val(false);
            showList(getCurrentPage());
        }
    });
    return false;
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

function getDropdownRaceHtml(id) {
    let race_id = "select_race_" + id;
    return "<label for='race'></label>"
        + "<select id=" + race_id + " name='race'>"
        + "<option value='DONE'>DONE</option>"
        + "<option value='PAUSED'>PAUSED</option>"
        + "<option value='IN_PROGRESS'>IN_PROGRESS</option>"

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
                showList(currentPage); // Обновляем таблицу после добавления задачи
            }
        });
        return false;

}



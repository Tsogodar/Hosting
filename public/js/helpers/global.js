$(document).ready(function () {
    // disable context menu
    $('body').contextmenu(function () {
        return false;
    });

    //disable text selecting
    $('body').css('user-select', 'none');

    //add autofocus o add folder modal form
    $('#addFolderModal').on('show.bs.modal', function () {
        $('#nameInput').focus();
    })

});
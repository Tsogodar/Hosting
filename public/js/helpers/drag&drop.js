$(document).ready(function () {
    $('.folder').draggable({
        helper: 'clone',
        opacity: 0.7
    });
    $('.file').draggable({
        helper: 'clone',
        opacity: 0.7
    });
    $('.folder').droppable({
        tolerance: 'pointer',
        drop: function (event, ui) {
            const droppableId = $(this).find('span')[0].className;
            const draggableId = ui.draggable[0].childNodes[5]['className'];
            $.ajax({
                type: "POST",
                url: `/folder/move/${droppableId}/${draggableId}`,
                success: function (response) {
                    if (response == true) {
                        ui.draggable.remove();
                        location.reload();
                    }
                }
            })
        }
    });
});
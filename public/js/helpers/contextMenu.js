$(document).ready(function () {
    $('.folder').on('contextmenu', function (event) {
        const folderId = event['currentTarget']['children'][2].className;
        $('.contextMenu').css({top: event.clientY, left: event.clientX});
        $.ajax({
            type: "GET",
            url: `/folder/${folderId}`,
            success: function (response) {
                console.log(response)
                let folders = [];
                response.forEach((folder) => {
                    folders.push([folder._id, folder.name])
                })
                    $('.contextMenu').html(
                        `<a href=/folder/${folderId}>Otwórz</a><br>
                         <a href=/folder/remove/${folderId}>Usuń</a><br>
                         <a href="" data-toggle="modal" data-folder-folders=${folders} data-id=${folderId}
                         data-target="#moveFolderModal">Przenieś</a>`
                    );
                $('.contextMenu').show();
            }
        });
    });
    $('body').click(function () {
        $('.contextMenu').hide();
    })
    $('#moveFolderModal').on('show.bs.modal', function (e) {
        let foldersData = $(e.relatedTarget).data('folder-folders');
        let folderId = $(e.relatedTarget).data('id');
        let folders = foldersData.split(",");
        $(this).find('form')[0]['attributes'][1]['value'] = `/folder/destination/${folderId}`;
        if (folders.length === 1) {
            $(this).find('.modal-body').html('Brak dostępnych lokalizacji do przeniesienia folderu');
        } else {
            for (let i = 1; i < folders.length; i = i + 2) {
                $('select').append($('<option> ', {
                    value: folders[i - 1],
                    text: folders[i],
                }));
            }
        }
    });
    $('#moveFolderModal').on('hide.bs.modal', function (e) {
        $('select').html('');
    })
    $('#showModal').modal({
        show:true
    })
});
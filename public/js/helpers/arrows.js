$(document).ready(function () {
    $('.arrRight').on('click', function () {
        if ($('audio').length != 0) {
            $('audio')[0].pause();
        }
        if ($('video').length != 0) {
            $('video')[1].pause();
        }
        let openedModalId = this.offsetParent.id;
        let openedModal = $('#' + openedModalId + '.detailsModal');
        if (openedModal.nextAll('.detailsModal:first')[0] == undefined) {
            $('#' + openedModalId).modal('close');
        } else {
            let nextModalId = openedModal.nextAll('.detailsModal:first')[0].id;
            $('#' + openedModalId).modal('close');
            $('#' + nextModalId).modal('open');

        }
    });

    $('.arrLeft').on('click', function () {
        if ($('audio').length != 0) {
            $('audio')[0].pause();
        }
        if ($('video').length != 0) {
            $('video')[1].pause();
        }
        let openedModalId = this.offsetParent.id;
        let openedModal = $('#' + openedModalId + '.detailsModal');
        if (openedModal.prevAll('.detailsModal:first')[0] == undefined) {
            $('#' + openedModalId).modal('close');
        } else {
            let prevModalId = openedModal.prevAll('.detailsModal:first')[0].id;
            $('#' + openedModalId).modal('close');
            $('#' + prevModalId).modal('open');
        }
    });

    $('.closeIcon').on('click', function () {
        if ($('audio').length != 0) {
            $('audio')[0].pause();
        }
        if ($('video').length != 0) {
            $('video')[1].pause();
        }
    });

});
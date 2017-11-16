$(document).ready(function () {
    $('.folder').click(function () {
        if ($(this).find('.folderMenu').css('opacity') == 0) {
            $('.folderMenu').css('opacity', 0);
            $('.actions a').hide();
            $(this).find('.folderMenu').animate({'opacity': 1});
            $(this).find('.actions a').show();
        } else {
            $(this).find('.folderMenu').animate({'opacity': 0});
            $(this).find('.actions a').hide();
        }
    })
});
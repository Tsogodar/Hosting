$(document).ready(function () {
    $('.file').click(function () {
        if ($(this).find('.fileMenu').css('opacity') == 0) {
            $('.fileMenu').css('opacity', 0);
            $('.fileActions a').hide();
            $(this).find('.fileMenu').animate({'opacity': 1});
            $(this).find('.fileActions a').show();
        } else {
            $(this).find('.fileMenu').animate({'opacity': 0});
            $(this).find('.fileActions a').hide();
        }
    })
});
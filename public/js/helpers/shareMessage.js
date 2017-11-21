function copyLink(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    if (document.execCommand("copy")) {
        $('.message').text('Skopiowano');
        setInterval(function () {
            $('.alert-success').animate({'opacity': 0})
        }, 1500)
    }
    $temp.remove();
}

function removeMessage(){
    setInterval(function () {
        $('.alert-success').animate({'opacity': 0})
    }, 1500)
}
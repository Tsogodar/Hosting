$(document).ready(function () {
    $('#fileToUpload').change(function () {
        let lenght = this.files.length;
        let size = 0;
        for (let i = 0; i < lenght; i++) {
            size += this.files[i].size;
        }
        $.ajax({
            type: "POST",
            url: "/file/space",
            dataType: 'json',
            data: {
                fileSize: JSON.stringify(size)
            },
            success: function (response) {
                let isFreeSpace = response.data;
                if (isFreeSpace === true) {
                    $('.addFileForm').submit();
                    // $('.spin').show();
                    // $('.btnUpload').attr("disabled", true).removeClass('btn-success').addClass('uploadInProgress');
                    // $('.btnUpload h5').html('Przesyłanie')
                } else {
                    // alert('Brak dostępnego miejsca');
                    $('#noFreeSpaceModal').modal('open');
                }
            }
        });
    })
});



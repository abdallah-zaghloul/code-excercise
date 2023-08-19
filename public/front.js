// JS code to validate the image before upload and display thumbnail
const fileInput = document.getElementById('image-upload')
    , thumbnailContainer = document.createElement('div')
    , thumbnail = document.createElement('img');

thumbnailContainer.appendChild(thumbnail);
document.body.appendChild(thumbnailContainer);

fileInput.addEventListener('change', function () {
    const file = fileInput.files.shift()
        , reader = new FileReader();

    reader.addEventListener('load', function () {
        thumbnail.src = reader.result;
    });

    if (file){
        switch (file){
            case !file:
                break;
            case file.size <= 2 * 1024 * 1024 :
                file.type.startsWith('image/') ? reader.readAsDataURL(file): alert('Invalid file format. Please select an image file.');
                break;
            default :
                alert('File size exceeds the limit. Please select a smaller file.');
        }
    }

    // if (file) {
    //     if (file.size <= 2 * 1024 * 1024) { // 2MB limit
    //         if (file.type.startsWith('image/')) {
    //             reader.readAsDataURL(file);
    //         } else {
    //             alert('Invalid file format. Please select an image file.');
    //         }
    //     } else {
    //         alert('File size exceeds the limit. Please select a smaller file.');
    //     }
    // }
});

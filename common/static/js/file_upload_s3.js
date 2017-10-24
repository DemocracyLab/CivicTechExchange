/**
 * Wire up S3 uploads to file select control
 *
 * @param inputId                   id of input control
 * @param previewImageId            id of thumbnail
 * @param previewPlaceholderImageId id of thumbnail placeholder (to be hidden on selection)
 */
function initializeS3UploadHander(inputId, previewImageId, previewPlaceholderImageId) {
    document.getElementById(inputId).onchange = function (event) {
        var files = event.target.files;
        var file = files[0];
        if (!file) {
            return alert("No file selected.");
        }
        doPresignedUploadToS3(file, previewImageId, previewPlaceholderImageId);
    };
}

function doPresignedUploadToS3(file, previewImageId, previewPlaceholderImageId){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/presign_s3/upload/project/thumbnail?file_type=" + file.type);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var response = JSON.parse(xhr.responseText);
                uploadFileToS3(file, response.data, response.url, previewImageId, previewPlaceholderImageId);
            }
            else{
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}

function uploadFileToS3(file, s3Data, url, previewImageId, previewPlaceholderImageId){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", s3Data.url);

    var postData = new FormData();
    for(key in s3Data.fields){
        postData.append(key, s3Data.fields[key]);
    }
    postData.append('file', file);

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 204){
                document.getElementById(previewImageId).src = url;
                document.getElementById(previewPlaceholderImageId).style.visibility = 'hidden';
            }
            else{
                alert("Could not upload file.");
            }
        }
    };
    xhr.send(postData);
}
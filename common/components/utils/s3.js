export function deleteFromS3(s3Key) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/delete_s3/" + s3Key);
  
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4){
      if(xhr.status !== 202 && xhr.status !== 204){
        alert("Could not delete file.");
      }
    }
  };
  xhr.send();
}
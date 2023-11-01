import htmlDocument from "./htmlDocument.js";

export function deleteFromS3(s3Key) {
  const cookies = htmlDocument.cookies();

  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/delete_s3/" + s3Key);
  xhr.setRequestHeader("X-CSRFToken", cookies["csrftoken"]);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status !== 202 && xhr.status !== 204) {
        alert("Could not delete file.");
      }
    }
  };
  xhr.send();
}

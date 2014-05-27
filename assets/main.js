function downloadFile(url, success) {
    var xhr = new XMLHttpRequest(); 
    xhr.open('GET', url, true); 
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4) {
            if (success) success(xhr.response);
        }
    };
    xhr.send(null);
}
function XHR(url, options) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        if (options && typeof(options.imageCrossOriginHandler) === "function") {
            var cors = options.imageCrossOriginHandler(url) || "";
            if (cors.match(/use-credentials/i)) {
                xhr.withCredentials = true;
            }
        }
        xhr.open('GET', url);

        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}

module.exports = XHR;

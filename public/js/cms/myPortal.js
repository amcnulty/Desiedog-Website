if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    function showUserName() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "../../users/userPresent", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                userNameSpan.innerHTML = xhr.responseText;
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 401) {
                // no user present
            }
        }
        xhr.send(null);
    }

    function createJadeFile() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "createJadeFile", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Jade file created at "views/articles/<name-of-file.jade>"
                console.log("SUCCESS");
            }
        }
        var myJSON = new Object();
        myJSON.title = articleTitleInput.value;
        myJSON.pageTitle = pageTitleInput.value;
        myJSON.paragraph = document.getElementById("paragraph").value;
        var jasonString = JSON.stringify(myJSON);
        xhr.send(jasonString);
    }

    function createTitle() {
        var title = articleTitleInput.value;
        title = title.replace(/\s+/g, '-').toLowerCase();
        pageTitleInput.value = title;
    }

    var userNameSpan = document.getElementById("userName");
    var articleTitleInput = document.getElementById("title");
    var pageTitleInput = document.getElementById("pageTitle");
    var submitButton = document.getElementById("submitButton");

    articleTitleInput.addEventListener("blur", createTitle, false);

    submitButton.addEventListener("click", createJadeFile, false);

    showUserName();
}
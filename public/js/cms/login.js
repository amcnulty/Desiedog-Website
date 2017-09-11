if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    function signIn() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "cms/login", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Login successful
                verifyUser();
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 401) {
                // password incorrect
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
                // forbidden - user not allowed access
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 404) {
                // username not found in database
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 500) {
                // Error has occured
            }
        }
        var myJSON = new Object();
        myJSON.userName = userNameInput.value;
        myJSON.password = passwordInput.value;
        var jasonString = JSON.stringify(myJSON);
        xhr.send(jasonString);
    }

    function verifyUser() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "cms/verifyUser", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                window.location = "cms/my-portal";
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
                // forbidden - user not allowed access
            }
        }
        xhr.send(null);
    }

    // The form inputs
    var userNameInput = document.getElementById("userName");
    var passwordInput = document.getElementById("password");
    var submitButton = document.getElementById("submitButton");

    submitButton.addEventListener("click", signIn, false);
}
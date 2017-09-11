if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var profilePic = document.getElementById("profilePic");
    var profilePicData = "";
    var imageBox = document.getElementById("imageBox");
    var myImage = document.getElementById("myImage");

    document.getElementById("submitButton").addEventListener("click", function() {
        encodeImageFileAsURL(profilePic);
    });

    function saveData() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/photo", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.status == XMLHttpRequest.DONE && xhr.status == 200) {
                // Success
            }
        }
        var jason = '{ "profileImg" : "' + profilePicData + '" }';
        console.log(jason);
        xhr.send(jason);
    }

    function encodeImageFileAsURL(element) {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            profilePicData = reader.result;
            saveData();
        };
        reader.readAsDataURL(file);
    }

    document.getElementById("check").addEventListener("click", function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/photo/load", true);
        xhr.onreadystatechange = function() {//Call a function when the state changes.
            if(xhr.status == 200) {
                // Do something with the response
                var data = xhr.response;
                console.log(data);
                myImage.src = data;
            }
        }
        xhr.send(null);
    });

    function readfiles(files) {
        for (var i = 0; i < files.length; i++) {
            reader = new FileReader();
            reader.onload = function(event) {
                profilePicData = event.target.result;
                saveData();
            }
            reader.readAsDataURL(files[i]);
        }
    }

    var holder = document.getElementById('holder');
    holder.ondragover = function () { this.style = "width:200px; height:200px; border: 10px dashed #0c0"; return false; };
    holder.ondragend = function () { this.style = "width:200px; height:200px; border: 10px dashed #ccc"; return false; };
    holder.ondrop = function (e) {
    this.style = "width:200px; height:200px; border: 10px dashed #ccc";
    e.preventDefault();
    readfiles(e.dataTransfer.files);
} 

}
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

    function publishArticle() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "publishArticle", true);
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
        myJSON.author = authorInput.value;
        myJSON.articleBody = generatedHTML.innerHTML;
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
    var authorInput = document.getElementById("author");
    var submitButton = document.getElementById("submitButton");

    articleTitleInput.addEventListener("blur", createTitle, false);

    submitButton.addEventListener("click", publishArticle, false);

    showUserName();

    var editor = new wysihtml5.Editor("wysihtml5-textarea", { // id of textarea element
        toolbar: "wysihtml5-toolbar", // id of toolbar element
        parserRules: wysihtml5ParserRules, // defined in parser rules set 
        stylesheets: ["../../tools/xing-wysihtml5-fb0cfe4/website/css/editor.css"]
    });
    var generatedHTML = document.getElementsByTagName("iframe")[0].contentDocument.children[0].children[1];
    var images = generatedHTML.getElementsByTagName("img");
    var imageOk = document.getElementById("imageOk");
    var imageCap = document.getElementById("imageCaption");
    imageOk.addEventListener("click", function() {
        setTimeout(function() {
            var newDiv = document.createElement("div");
            newDiv.className = "imageWrapper";
            var thisImage = images[images.length - 1];
            thisImage.className = "articleImage";
            newDiv.appendChild(thisImage);
            var caption = document.createElement("p");
            caption.className = "imageCaption";
            caption.innerHTML = imageCap.value;
            newDiv.appendChild(caption);
            generatedHTML.appendChild(newDiv);
            generatedHTML.appendChild(document.createElement("br"));
            generatedHTML.innerHTML += "Continue next paragraph here. To add another image delete this line and insert image on this line. The line above is for editing the caption on the previous image."
            generatedHTML.removeChild(images[images.length - 1]);
        }, 2000);
    }, false);
}
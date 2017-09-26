if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    // Variables for general portal elements
    var tabViews = [];
    var tabs = document.getElementsByClassName("tab");
    var views = document.getElementsByClassName("mainView");
    // Variables for the articles view
    var articles;
    var articleTabViews = [];
    var AVtabs = document.getElementsByClassName("AVheaderItem");
    var AVsubViews = document.getElementsByClassName("AVsubView");
    var posterInput = document.getElementById("poster");
    var headlineInput = document.getElementById("headline");
    var articleTitleInput = document.getElementById("title");
    var pageTitleInput = document.getElementById("pageTitle");
    var authorInput = document.getElementById("author");
    var submitButton = document.getElementById("submitButton");
    var updateButton = document.getElementById("updateButton");
    var resetButton = document.getElementById("resetButton");
    var imageOk = document.getElementById("imageOk");
    var imageCap = document.getElementById("imageCaption");
    var userNameSpan = document.getElementById("userName");
    var editor = new wysihtml5.Editor("wysihtml5-textarea", {
        toolbar: "wysihtml5-toolbar",
        parserRules: wysihtml5ParserRules,
        stylesheets: ["../../tools/xing-wysihtml5-fb0cfe4/website/css/editor.css"]
    });
    var generatedHTML = document.getElementsByTagName("iframe")[0].contentDocument.children[0].children[1];
    var images = generatedHTML.getElementsByTagName("img");
    var articlesToBeDeleted = [];
    var deleteButton = document.getElementById("deleteButton");

    function TabView(tab, view) {
        this.tab = tab;
        this.view = view;
        this.tab.addEventListener("click", function() {
            resetTabViews();
            tab.className = "tab selectedTab";
            view.style.display = "block";
        }, false);
    }

    function SubTabView(tab, view, list, unselectedClass, selectedClass) {
        this.tab = tab;
        this.view = view;
        this.list = list;
        this.unselectedClass = unselectedClass;
        this.selectedClass = selectedClass;
        this.changeSelectedTab = function() {
            for (var i = 0; i < list.length; i++) {
                list[i].tab.className = unselectedClass;
                list[i].view.style.display = "none";
            }
            tab.className = selectedClass;
            view.style.display = "block";
        }
    }

    function resetTabViews() {
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].className = "tab";
            views[i].style.display = "none";
        }
    }

    function clearNewArticle() {
        posterInput.value = "";
        headlineInput.value = "";
        articleTitleInput.value = "";
        pageTitleInput.value = "";
        pageTitleInput.readOnly = false;
        authorInput.value = "";
        generatedHTML.innerHTML = "";
        submitButton.style.display = "block";
        updateButton.style.display = "none";
    }

    function publishArticle() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "publishArticle", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                alert("You have successfully published a new article!")
                // TODO: alert the user that page has been successfully published
            }
        }
        var myJSON = new Object();
        myJSON.poster = posterInput.value;
        myJSON.headline = headlineInput.value;
        myJSON.title = articleTitleInput.value;
        myJSON.pageTitle = pageTitleInput.value;
        myJSON.author = authorInput.value;
        myJSON.date = formatDate(new Date());
        myJSON.articleBody = generatedHTML.innerHTML;
        var jasonString = JSON.stringify(myJSON);
        xhr.send(jasonString);
    }

    function updateArticle() {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "updateArticle", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                alert("You have successfully updated the article!");
                clearNewArticle();
            }
        }
        var myJSON = new Object();
        myJSON.poster = posterInput.value;
        myJSON.headline = headlineInput.value;
        myJSON.title = articleTitleInput.value;
        myJSON.pageTitle = pageTitleInput.value;
        myJSON.author = authorInput.value;
        myJSON.articleBody = generatedHTML.innerHTML;
        var jasonString = JSON.stringify(myJSON);
        xhr.send(jasonString);
    }

    function deleteArticles() {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "deleteArticle", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                alert("Successfully deleted content.")
            }
        }
        var myJSON = new Object();
        myJSON.articles = articlesToBeDeleted;
        var jasonString = JSON.stringify(myJSON);
        console.log(jasonString);
        xhr.send(jasonString);
    }

    function formatDate(date) {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
      
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
      
        return monthNames[monthIndex] + ' ' + day + ", " + year;
      }

    function createTitle() {
        var title = articleTitleInput.value;
        title = title.replace(/\s+/g, '-').toLowerCase();
        pageTitleInput.value = title;
    }

    function loadArticles() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "articles", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                articles = JSON.parse(xhr.responseText);
                for (var i = 0; i < articles.length; i++) {
                    populateList(articles[i]);
                }
            }
        }
        xhr.send(null);
    }

    function populateList(article) {
        for (var i = 0; i < 3; i++) {
            var articleBox = document.createElement("div");
            articleBox.className = "smallArticle";
            var imagePoster = document.createElement("img");
            imagePoster.className = "articlePoster";
            imagePoster.src = article.poster;
            articleBox.appendChild(imagePoster);
            var headline = document.createElement("p");
            headline.className = "articleHeadline";
            headline.innerHTML = article.headline;
            articleBox.title = article.title;
            articleBox.appendChild(headline);
            if (i === 0) {
                document.getElementById("AVeditLoadedArticles").appendChild(articleBox);
                articleBox.addEventListener("click", function(e) {
                    for (var i = 0; i < articles.length; i++) {
                        if (articles[i].title === e.currentTarget.title) {
                            posterInput.value = articles[i].poster;
                            headlineInput.value = articles[i].headline;
                            articleTitleInput.value = articles[i].title;
                            pageTitleInput.value = articles[i].pageTitle;
                            pageTitleInput.readOnly = true;
                            authorInput.value = articles[i].author;
                            generatedHTML.innerHTML = articles[i].articleBody;
                            submitButton.style.display = "none";
                            updateButton.style.display = "block";
                            articleTabViews[0].changeSelectedTab();
                        }
                    }
                }, false)
            }
            else if (i === 1) {
                document.getElementById("AVdeleteLoadedArticles").appendChild(articleBox);
                articleBox.addEventListener("click", function(e) {
                    if (e.currentTarget.className === "smallArticle") {
                        e.currentTarget.className = "smallArticle redBorder";
                    }
                    else {
                        e.currentTarget.className = "smallArticle";
                    }
                    articlesToBeDeleted = [];
                    for (var i = 0; i < articles.length; i++) {
                        for (var j = 0; j < document.getElementsByClassName("redBorder").length; j++) {
                            if (articles[i].title === document.getElementsByClassName("redBorder")[j].title) {
                                articlesToBeDeleted.push(articles[i].pageTitle);
                            }
                        }
                    }
                }, false)
            }
            else if (i === 2) {
                document.getElementById("AVfeaturedLoadedArticles").appendChild(articleBox);
                articleBox.addEventListener("click", function(e) {
                    console.log("I belong to featured articles");
                }, false)
            }
        }
    }

    for (var i = 0; i < tabs.length; i++) {
        tabViews[i] = new TabView(tabs[i], views[i]);
    }

    for (var i = 0; i < AVtabs.length; i++) {
        articleTabViews[i] = new SubTabView(AVtabs[i], AVsubViews[i], articleTabViews, "AVheaderItem", "AVheaderItem selected");
        articleTabViews[i].tab.addEventListener("click", articleTabViews[i].changeSelectedTab, false);
    }

    articleTitleInput.addEventListener("blur", createTitle, false);

    submitButton.addEventListener("click", publishArticle, false);

    updateButton.addEventListener("click", updateArticle, false);

    resetButton.addEventListener("click", clearNewArticle, false);

    deleteButton.addEventListener("click", function() {
        if (articlesToBeDeleted.length === 0) alert("You haven't selected any articles to delete!");
        else if (confirm("Are you sure? This will permanently delete the selected articles from the database.")) {
            deleteArticles();
        }
    }, false);

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
        }, 1000);
    }, false);

    tabViews[0].tab.click();
    articleTabViews[0].tab.click();
    loadArticles();
}
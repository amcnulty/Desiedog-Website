if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var articles;
    var featuredBox = document.getElementById("featuredBox");
    var featuredPoster = document.getElementById("featuredPoster");
    var featuredHeadline = document.getElementById("featuredHeadline");
    var featuredLink = document.getElementById("featuredLink");
    var articleSection = document.getElementById("articleSection");

    function loadArticles() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "cms/articles");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                articles = JSON.parse(xhr.responseText);
                for (var i = 0; i < articles.length; i++) {
                    if (articles[i].featured) {
                        showFeatured(articles[i]);
                    }
                    else populateList(articles[i]);
                }
            }
        }
        xhr.send(null);
    }

    function populateList(article) {
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
        articleSection.appendChild(articleBox);
        articleBox.addEventListener("click", function(e) {
            window.location = "../articles/" + article.pageTitle;
        }, false)
    }

    function showFeatured(article) {
        featuredBox.title = article.title;
        featuredPoster.src = article.poster;
        featuredHeadline.innerHTML = article.headline;
        featuredLink.href = "../articles/" + article.pageTitle;
    }

    featuredBox.addEventListener("click", function() {
        window.location = featuredLink.href;
    }, false);

    loadArticles();
}
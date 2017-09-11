if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    function populateList() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "cms/articles");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var articles = JSON.parse(xhr.responseText);
                for (var i = 0; i < articles.length; i++) {
                    createLink(articles[i].title, "../articles/" + articles[i].location);
                }
            }
        }
        xhr.send(null);
    }

    function createLink(name, ref) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = ref;
        a.innerHTML = name;
        li.appendChild(a);
        articleList.appendChild(li);
    }

    var articleList = document.getElementById("articleLinks");

    populateList();
}
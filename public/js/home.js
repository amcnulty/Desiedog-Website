if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    // info boxes on home page
    var aboutBox = document.getElementById("aboutIB");
    var forumBox = document.getElementById("forumIB");
    var galleryBox = document.getElementById("galleryIB");
    var shopBox = document.getElementById("shopIB");

    aboutBox.addEventListener("click", function() {
        window.location = "/about";
    });
    forumBox.addEventListener("click", function() {
        window.location = "/forum";
    });
    galleryBox.addEventListener("click", function() {
        window.location = "/gallery";
    });
    shopBox.addEventListener("click", function() {
        window.location = "/shop";
    });
}
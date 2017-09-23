if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    function scrollTo(obj) {
        $('html, body').animate(obj, 600);
    }

    var missionScroll = {scrollTop: $("#ourMissionSection").offset().top};
    var developerScroll = {scrollTop: $("#developerSection").offset().top};
    var storyScroll = {scrollTop: $("#storySection").offset().top};
    var teamScroll = {scrollTop: $("#teamSection").offset().top};
    var faqScroll = {scrollTop: $("#faqSection").offset().top};

    document.getElementById("mission").addEventListener("click", function() {
        scrollTo(missionScroll);
    }, false);

    document.getElementById("developer").addEventListener("click", function() {
        scrollTo(developerScroll);
    }, false);

    document.getElementById("story").addEventListener("click", function() {
        scrollTo(storyScroll);
    }, false);

    document.getElementById("team").addEventListener("click", function() {
        scrollTo(teamScroll);
    }, false);

    document.getElementById("faq").addEventListener("click", function() {
        scrollTo(faqScroll);
    }, false);
}
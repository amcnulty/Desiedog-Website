if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    // // Loads template html partials into main document
    // function loadTemplates(templates) {
    //     for (var i = 0; i < templates.length; i++) {
    //         $(templates[i]).load(templates[i].dataset.include, function() {
    //             if (document.getElementById("signIn") != undefined) {
    //                 signIn = document.getElementById("signIn");
    //                 loggedIn = document.getElementById("loggedIn");
    //                 checkForUser();
    //                 setHeaderListeners();
    //             }
    //         });
    //     }
    // }
    // // This function will exicute when page is loaded.
    // // Function will check for user and display the appropriate
    // // information in the header.
    // function checkForUser() {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", "/userPresent", true);
    //     xhr.onreadystatechange = function() {
    //         if (xhr.status == 200) {
    //             // There is a user present
    //             loggedIn.style.display = "inline-block";
    //             signIn.style.display = "none";
    //         }
    //         else if (xhr.status = 401) {
    //             // Ther is no user present
    //             loggedIn.style.display = "none";
    //             signIn.style.display = "inline-block";
    //         }
    //     }
    //     xhr.send(null);
    // }
    function scrollTo(obj) {
        $('html, body').animate(obj, 600);
    }

    // var includedTemplates = document.querySelectorAll('[data-include]');
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


    // loadTemplates(includedTemplates);
}
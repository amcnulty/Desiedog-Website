if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    // Loads template html partials into main document 
    // and calls a funtion when loading is complete.
    function loadTemplates(templates, loadingComplete) {
        var count = 0;
        for (var i = 0; i < templates.length; i++) {
            $(templates[i]).load(templates[i].dataset.include, function() {
                    count++;
                    if (count == templates.length) {
                        loadingComplete();
                    }
            });
        }
    }
    // This function will exicute when page is loaded.
    // Function will check for user and display the appropriate
    // information in the header.
    function checkForUser() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/userPresent", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // There is a user present
                loggedIn.style.display = "inline-block";
                signIn.style.display = "none";
                topBarUserName.innerHTML = xhr.responseText;
                // Close pop up window in case it is open
                closePopUpWindow();
            }
            else if (xhr.status == 401) {
                // There is no user present
                loggedIn.style.display = "none";
                signIn.style.display = "inline-block";
            }
        }
        xhr.send(null);
    }
    // Sets event listener for user section in header
    function setHeaderListeners() {
            signIn.addEventListener("click", function() {
                shadder.className = "showPopUp";
                signInBox.className = "showSignInBox";
                signInUsername.focus();
            }, false);
            loggedIn.addEventListener("click", function() {
                showDropDown();
            }, false);
            loggedIn.addEventListener("mouseleave", function() {
                hideDropDown();
            }, false);
            portalButton.addEventListener("click", function() {
                window.location = "cms/my-portal";
            }, false);
            logOutButton.addEventListener("click", logUserOut, false);
            // If user presses enter on forms it will send data
            signInView.addEventListener("keyup", function(e) {
                if (e.keyCode === 13) signInConfirmButton.click();
            }, false);
            regView.addEventListener("keyup", function(e) {
                if (e.keyCode === 13) regButton.click();
            }, false);
            // close popup if exit button or escape key is pressed
            popUpExitButton.addEventListener("click", closePopUpWindow, false);
            document.addEventListener("keyup", function(e) {
                if (e.keyCode === 27) closePopUpWindow();
            }, false);
            signInConfirmButton.addEventListener("click", function() {
                sanitizeSignInForm();
            }, false);
            regButton.addEventListener("click", function() {
                sanitizeRegForm();
            }, false);
    }
    function showDropDown() {
        dropDownBox.className = "showDropDown";
    }
    function hideDropDown() {
        if (dropDownBox != null) dropDownBox.className = "";
    }
    function closePopUpWindow() {
        shadder.className = "";
        signInBox.className = "";
    }
    function sanitizeSignInForm() {
        clearErrorMessages();
        if (signInUsername.value === "" || signInUsername.value.indexOf(' ') >= 0) {
            displayError(signInUsernameError);
            return null;
        }
        if (signInPassword.value === "" || signInPassword.value.length <= 5) {
            displayError(signInPasswordError);
            return null;
        }
        signUserIn();
    }
    function sanitizeRegForm() {
        clearErrorMessages();
        if (regUsername.value === "" || regUsername.value.indexOf(' ') >= 0) {
            displayError(regUsernameError);
            return null;
        }
        if (regPassword.value === "" || regPassword.value.length <= 5) {
            displayError(regPasswordError);
            return null;
        }
        if (confirmPassword === "" || confirmPassword.value.length <= 5 || confirmPassword.value != regPassword.value) {
            displayError(confirmPasswordError);
            return null;
        }
        registerUser();
    }
    function displayError(errorMessage) {
        errorMessage.style.visibility = "visible";
    }
    function clearErrorMessages() {
        var errorMessages = document.getElementsByClassName("popupInputError");
        for (var i = 0; i < errorMessages.length; i++) {
            errorMessages[i].style.visibility = "hidden";
        }
    }
    // Temporarily signs in a user
    function signUserIn() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/login", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Login successful
                // topBarUserName.innerHTML = xhr.responseText;
                checkForUser();
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 404) {
                // username not found in database
                displayError(signInUsernameError);
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 401) {
                // password incorrect
                displayError(signInPasswordError);
            }
        }
        var jason = new Object();
        jason.userName = document.getElementById("signInUsername").value;
        jason.password = document.getElementById("signInPassword").value;
        var jasonString = JSON.stringify(jason);
        xhr.send(jasonString);
    }
    function registerUser() {
        console.log("Registering User");
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/register", true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // registration successful
                console.log("Registration Successful!");
            }
            else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 500) {
                // registration failed
                console.error("Registration failed");
            }
        }
        var jason = new Object();
        jason.userName = document.getElementById("regUsername").value;
        jason.password = document.getElementById("confirmPassword").value;
        var jasonString = JSON.stringify(jason);
        xhr.send(jasonString);
    }
    // Logs out active user 
    function logUserOut() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/logout", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                checkForUser();
            }
        }
        xhr.send(null);
    }
    // Creates two panel objects
    function createPanels() {
        panels[0] = new Panel(document.getElementById("signInTab"), document.getElementById("signInView"), 0);
        panels[1] = new Panel(document.getElementById("registerTab"), document.getElementById("regView"), 1);
    }
    // Panel constructor
    function Panel(tab, view, index) {
        this.tab = tab;
        this.view = view;
        this.index = index;
        this.tab.addEventListener("click", function() {
            tabClicked(index);
        }, false);
        function show() {
            tab.style.backgroundColor = "white";
            view.style.visibility = "visible";
            view.style.zIndex = "1";
        }
        this.show = show;
        function hide() {
            tab.style.removeProperty("background-color");
            view.style.visibility = "hidden";
            view.style.zIndex = "0";
        }
        this.hide = hide;
    }
    function tabClicked(index) {
        if (currentPanelIndex != null) {
            panels[currentPanelIndex].hide();
        }
        currentPanelIndex = index;
        panels[index].show();
    }
    // Login info variables
    var signIn = null;
    var loggedIn = null;
    var topBarUserName = null;
    // The drop down box once logged in
    var dropDownBox = null;
    var dashboardButton = null;
    var messagesButton = null;
    var portalButton = null;
    var settingsButton = null;
    var logOutButton = null;
    // List of views to be displayed by tab click
    var panels = [];
    var currentPanelIndex = null;
    // The shadder element that show behind signin/register pop-up box
    var shadder = document.createElement('div');
    shadder.id = 'shadder';
    shadder.setAttribute('data-include', '../templates/popUps/signIn.html');
    // Add shadder element to document
    document.body.appendChild(shadder);
    // The sign in box inside the shadder wrapper
    var signInBox = null;
    // The sign in view
    var signInView = null;
    // Sign in username error message
    var signInUsernameError = null;
    // Sign in username field
    var signInUsername = null;
    // Sign in password error message
    var signInPasswordError = null;
    // Sign in password field
    var signInPassword = null;
    // Confirm sign in button
    var signInConfirmButton = null;
    // The register vew
    var regView = null;
    // Register username error message
    var regUsernameError = null;
    // Register username field
    var regUsername = null;
    // Register password error message
    var regPasswordError = null;
    // Register password field
    var regPassword = null;
    // Register confirm password error message
    var confirmPasswordError = null;
    // Register confirm password field
    var confirmPassword = null;
    // Register button
    var regButton = null;
    // The exit button on the popup window
    var popUpExitButton = null;
    // Templates to be loaded for header and footer
    var includedTemplates = document.querySelectorAll('[data-include]');
    // Load templates and handle callback on loading complete
    loadTemplates(includedTemplates, function() {
        signIn = document.getElementById("signIn");
        loggedIn = document.getElementById("loggedIn");
        topBarUserName = document.getElementById("topBarUserName");
        dropDownBox = document.getElementById("loggedInDropDown");
        dashboardButton = document.getElementById("dashboardButton");
        messagesButton = document.getElementById("messagesButton");
        portalButton = document.getElementById("portalButton");
        settingsButton = document.getElementById("settingsButton");
        logOutButton = document.getElementById("logOutButton");
        signInBox = document.getElementById("signInBox");
        popUpExitButton = document.getElementById("popupExitButton");
        signInView = document.getElementById("signInView");
        signInUsernameError = document.getElementById("signInUsernameError");
        signInUsername = document.getElementById("signInUsername");
        signInPasswordError = document.getElementById("signInPasswordError");
        signInPassword = document.getElementById("signInPassword");
        signInConfirmButton = document.getElementById("popupConfirmButton");
        regView = document.getElementById("regView");
        regUsernameError = document.getElementById("regUsernameError");
        regUsername = document.getElementById("regUsername");
        regPasswordError = document.getElementById("regPasswordError");
        regPassword = document.getElementById("regPassword");
        confirmPasswordError = document.getElementById("confirmPasswordError");
        confirmPassword = document.getElementById("confirmPassword");
        regButton = document.getElementById("popupRegButton");
        checkForUser();
        setHeaderListeners();
        createPanels();
        tabClicked(0);
    });
}
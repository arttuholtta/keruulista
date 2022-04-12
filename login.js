if(window.location.protocol == "http:") {
    var oUrl = window.location.href
    oUrl = oUrl.replace(/^http:\/\//i, 'https://')
    window.location.replace(oUrl)
}



var input = document.getElementById("password")
input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("loginButton").click();
    }
});

function login() {
    user = document.getElementById("user").value
    password = document.getElementById("password").value
    if (user == "keraaja1" && password == "lista") {
        window.location.href = "search.html"
    } else {
        document.getElementById("loginError").style.visibility = "visible"
    }
}
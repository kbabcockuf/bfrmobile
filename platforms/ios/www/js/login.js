$(function () {
    $("#loginForm").on("submit", function (y) {
        //disable the button so we can't resubmit while we wait
        $("#submitButton", this).attr("disabled", "disabled");
        var e = $("#email").val();
        var p = $("#password").val();
        $.ajax({
            type: "POST",
            url: "http://dev.boulderfoodrescue.org/volunteers/sign_in.json",
            data: { email: e, password: p },
            success: function (data) {
                console.log("Success (sign_in)");
                window.localStorage.token = data.authentication_token;
                window.localStorage.email = e;
                window.location = ("index.html");
            },
            error: function (msg) {
            	navigator.notification.alert("Please check your username and password and"
            		+ " try again. " + msg, null, "Login Failed");
            }
        });
        $("#submitButton").removeAttr("disabled");
        return false;
    });
});

function init() {
    //document.addEventListener("deviceready", deviceReady, true);
    delete init;
}

//function myFunction() {
//    alert("You failed");
//    $.post("http://dev.boulderfoodrescue.org/volunteers/sign_in.json?email=julia@dragondev.com&password=dr@g0ndream", function(data) {
//            if(data == true) {
//                alert("Your login succeeded");
//                window.location = ("home.html");
//            } else {
//                alert("Your login failed");
//            }
//        }
//    // window.location = ("home.html");
//    // $.mobile.changePage("home.html");
//}

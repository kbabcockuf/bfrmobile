$(function () {
    $("#loginForm").on("submit", function (y) {
        //disable the button so we can't resubmit while we wait
        $("#submitButton", this).attr("disabled", "disabled");
        var e = $("#email").val();
        var p = $("#password").val();
        $.ajax({
            type: "POST",
            url: "http://boulderfoodrescue.org/volunteers/sign_in.json",
            data: { email: e, password: p },
            success: function (data) {
                console.log("Success (sign_in)");
                window.localStorage.token = data.authentication_token;
                window.localStorage.email = e;
                window.location = ("index.html");
            },
            error: function (msg) {
            	navigator.notification.alert("Please check your username and password.",
            		null, "Login Failed");
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

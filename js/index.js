// $('#reposHome').bind('pageinit', function(event) {
// 	loadRepos();
// });

// function loadRepos() {
//     // Obvi not the right database...
//     $.ajax("https://api.github.com/legacy/repos/search/javascript").done(function(data) {
//         var repo;
//         $.each(data.repositories, function (i, repo) {
//             $("#allRepos").append("<li><a href='https://github.com/" + repo.username + "/" + repo.name + "'>"
//                 + "<h4>" + repo.name + "</h4>"
//                 + "<p>" + repo.username + "</p></a></li>");
//         });
//         $('#allRepos').listview('refresh');
//     });
// }

function init() {
    document.addEventListener("deviceready", deviceReady, true);
    delete init;
}

function deviceReady() {

    $("#loginForm").on("submit",function(y) {
    //disable the button so we can't resubmit while we wait
    $("#submitButton",this).attr("disabled","disabled");
    var e = $("#email", this).val();
    var p = $("#password", this).val();
    if(e != '' && p!= '') {
        $.post("http://dev.boulderfoodrescue.org/volunteers/sign_in.json", {email:e,password:p}, function(data) {
            if(data == true) {
                window.location = ("home.html");
            } else {
                alert("Your login failed");
            }
            $("#submitButton").removeAttr("disabled");
        },"json");
    }
    return false;
});

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

import { TokenManager } from "./TokenManager";
var tokenPromise = TokenManager.getToken();
$(async () => {
    if (!(await tokenPromise)) {
        window.location.href = "login.html";
    }
    $("#sidebar-name").text(window.localStorage.getItem("zhixue-user-name"));
    $("#sidebar-class").text(window.localStorage.getItem("zhixue-class-name"));
    $("#sidebar-school").text(window.localStorage.getItem("zhixue-school-name"));
    $('#zx-tab .nav-link').on("click",function (e) {
        $(this).tab('show')
    })

    $("#content").attr("src", "home.html");
});

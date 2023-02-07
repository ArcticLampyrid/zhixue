import { TokenManager } from "./TokenManager";
var tokenPromise = TokenManager.getToken();
$(async () => {
    if (!(await tokenPromise)) {
        window.location.href = "login.html";
    }
    $("#sidebar-name").text(window.localStorage.getItem("zhixue-user-name"));
    $("#sidebar-class").text(window.localStorage.getItem("zhixue-class-name"));
    $("#sidebar-school").text(window.localStorage.getItem("zhixue-school-name"));
    $("#sidebar-user-code").text(window.localStorage.getItem("zhixue-user-code"));
    $("#sidebar-user-avatar").attr("src", window.localStorage.getItem("zhixue-user-avatar"));
    $('#zx-tab .nav-link').on("click",function (e) {
        $(this).tab('show')
    })

    $("#content").attr("src", "home.html");
});

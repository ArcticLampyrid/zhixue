import { zhixue } from "../server/zhixue";
$(() => {
    $("#login-username").on("keydown", (e) => {
        if (e.which == 13) {
            e.preventDefault();
            $("#login-password").focus();
        }
    });
    $("#login-form").on("submit", (e) => {
        (async () => {
            e.preventDefault();
            var username = $("#login-username").val() as string;
            var password = $("#login-password").val() as string;
            var info = await zhixue.login(username, password);
            if (info.errorCode) {
                var templateContent = document.querySelector<HTMLTemplateElement>("#errorAlertTemplater").content;
                var node = document.importNode(templateContent, true);
                $(node).find(".errorInfo").text(info.errorInfo);
                $("#placeForErrorAlert")
                    .empty()
                    .append(node);
            } else {
                window.sessionStorage.setItem("zhixue-token", info.result.token);
                window.sessionStorage.setItem("zhixue-token-expiTime", (new Date().getTime() + 10 * 60 * 1000 /*10 minutes*/).toString());

                window.localStorage.setItem("zhixue-username", username);
                window.localStorage.setItem("zhixue-password", password);
                window.localStorage.setItem("zhixue-childId", info.result.childId);
                window.localStorage.setItem("zhixue-user-name", info.result.user.name);
                window.localStorage.setItem("zhixue-class-name", info.result.class.name);
                window.localStorage.setItem("zhixue-school-name", info.result.school.name);
                window.location.href = "index.html";
            }
        })();
    });
});

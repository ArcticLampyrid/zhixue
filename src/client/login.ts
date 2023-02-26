import { TokenManager } from "./TokenManager";
import * as $ from 'jquery';
import 'bootstrap';
$(() => {
    $("#login-username").on("keydown", (e) => {
        if (e.code == "Enter" || e.code == "NumpadEnter") {
            e.preventDefault();
            $("#login-password").trigger('focus');
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
                window.localStorage.setItem("zhixue-username", username);
                window.localStorage.setItem("zhixue-password", password);
                TokenManager.saveLoginInfo(info);
                window.location.href = "index.html";
            }
        })();
    });
});

import { TokenManager } from "./TokenManager";
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
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
    var triggerTabList = [].slice.call(document.querySelectorAll('#zx-tab .nav-link'))
    triggerTabList.forEach(function (triggerEl: Element) {
        var tabTrigger = new bootstrap.Tab(triggerEl)
        triggerEl.addEventListener('click', function (event) {
            tabTrigger.show()
        })
    });
    $("#content").attr("src", "home.html");
});

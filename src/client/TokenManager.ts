import { zhixue } from "../server/zhixue";
export module TokenManager {
    export async function getToken(): Promise<string> {
        if (Number.parseInt(window.sessionStorage.getItem("zhixue-token-expiTime"), 10) < new Date().getTime()) {
            window.sessionStorage.removeItem("zhixue-token");
        }
        var token = window.sessionStorage.getItem("zhixue-token");
        if (!token) {
            var username = window.localStorage.getItem("zhixue-username");
            var password = window.localStorage.getItem("zhixue-password");
            var info = await zhixue.login(username, password);
            if (!info.errorCode) {
                token = info.result.token;
                window.sessionStorage.setItem("zhixue-token", token);
                window.sessionStorage.setItem("zhixue-token-expiTime", (new Date().getTime() + 10 * 60 * 1000 /*10 minutes*/).toString());
            }
        }
        return token;
    }
    export async function getChildId(): Promise<string> {
        return window.localStorage.getItem("zhixue-childId");
    }
}
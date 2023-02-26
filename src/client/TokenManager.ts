export module TokenManager {
    export async function getToken(): Promise<string> {
        if (Number.parseInt(window.sessionStorage.getItem("zhixue-token-expiTime"), 10) < new Date().getTime()) {
            window.sessionStorage.removeItem("zhixue-token");
        }
        var token = window.sessionStorage.getItem("zhixue-token");
        if (token) {
            return token;
        }
        var username = window.localStorage.getItem("zhixue-username");
        var password = window.localStorage.getItem("zhixue-password");
        var info = await zhixue.login(username, password);
        if (!info.errorCode) {
            token = info.result.token;
            saveLoginInfo(info);
            return token;
        }
        return null;
    }
    export async function getChildId(): Promise<string> {
        return window.localStorage.getItem("zhixue-childId");
    }
    export function saveLoginInfo(info: import('../server/zhixue').zhixue.LoginResult) {
        window.sessionStorage.setItem("zhixue-token", info.result.token);
        window.sessionStorage.setItem("zhixue-token-expiTime", (new Date().getTime() + 10 * 60 * 1000 /*10 minutes*/).toString());
        window.localStorage.setItem("zhixue-childId", info.result.childId);
        window.localStorage.setItem("zhixue-user-name", info.result.user.name);
        window.localStorage.setItem("zhixue-user-code", info.result.user.code);
        window.localStorage.setItem("zhixue-user-avatar", info.result.user.avatar);
        window.localStorage.setItem("zhixue-class-name", info.result.class.name);
        window.localStorage.setItem("zhixue-school-name", info.result.school.name);
    }
}
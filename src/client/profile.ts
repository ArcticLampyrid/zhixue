$(() => {
    $("#user-name").text(window.localStorage.getItem("zhixue-user-name"));
    $("#class-name").text(window.localStorage.getItem("zhixue-class-name"));
    $("#school-name").text(window.localStorage.getItem("zhixue-school-name"));
});
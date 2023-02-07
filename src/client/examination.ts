import { zhixue } from "../server/zhixue";
import { TokenManager } from "./TokenManager";
import * as querystring from 'querystring';
async function loadMore() {
    var param = querystring.parse(window.location.search.substr(1));

    $("#btn-more")
        .text("Loading...")
        .attr("disabled", "disabled");
    var pageSize = 10;
    var pageIndex = $("#list-exam").children().length / pageSize + 1;
    var info = await zhixue.getExemList(await TokenManager.getToken(), await TokenManager.getChildId(), pageIndex, pageSize, param["reportType"] as string || "exam");
    if (info.errorCode) {
        alert("(code: " + info.errorCode + ")" + info.errorInfo);
        return;
    }

    var templateContent = document.querySelector<HTMLTemplateElement>("#template-view-detail").content;
    for (let exam of info.result.examList) {
        var node = document.importNode(templateContent, true);
        $(node).find("div")
            .attr("x-zx-examId", exam.id)
            .on('click', function (e) {
                window.location.assign("examination_detail.html?examId=" + $(this).attr("x-zx-examId"));
            });
        $(node).find(".exam-name").text(exam.name);
        if (!exam.isFinal) {
            $(node).find(".exam-notFinal").removeClass("d-none");
        }
        $("#list-exam").append(node);
    }
    if (!info.result.hasNextPage) {
        $("#btn-more").hide();
    }
    $("#btn-more")
        .text("More")
        .removeAttr("disabled");
}
$(() => {
    loadMore();
    $("#btn-more").on('click', loadMore);
});
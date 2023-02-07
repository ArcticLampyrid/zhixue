import { zhixue } from "../server/zhixue";
import { TokenManager } from "./TokenManager";
import * as querystring from 'querystring';
import * as Sugar from 'sugar';

$(async () => {
    var param = querystring.parse(window.location.search.substr(1));
    var paperId = param.paperId as string;

    var info = await zhixue.getPaperAnalysis(await TokenManager.getToken(), await TokenManager.getChildId(), paperId);
    if (info.errorCode) {
        alert("(code: " + info.errorCode + ")" + info.errorInfo);
        return;
    }

    var templateContent = document.querySelector<HTMLTemplateElement>("#template-question").content;
    for (let group of info.result) {
        for (let question of group.questions) {
            var node = document.importNode(templateContent, true);
            if (!question.isCorrect) {
                $(node).find(".question-analysis").addClass("answer-not-correct");
            }
            $(node).find(".question-title").text(question.title);
            $(node).find(".question-userScore").text(question.userScore);
            $(node).find(".question-standardScore").text(question.standardScore);

            $(node).find(".question-content").html(question.standardAnswerHtml);
            $(node).find(".dropdown-content-type-button").text($(node).find(".dropdown-item-standardAnswer").text());

            $(node).find(".dropdown-item").on("click", (e) => {
                e.preventDefault();
                var root = $(e.target).parents(".question-analysis");
                root.find(".question-content").html(question[$(e.target).attr("x-data-name")]);
                root.find(".dropdown-content-type-button").text($(e.target).text());
            });
            $("#list-question").append(node);
        }
    }
});

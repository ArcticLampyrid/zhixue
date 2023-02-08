import { zhixue } from "../server/zhixue";
import { TokenManager } from "./TokenManager";
import * as querystring from 'querystring';
const katex = require('katex');
$(async () => {
    var processHtmlContent = (originHtml: string) => {
        const tempDoc = document.implementation.createHTMLDocument("latex-render");
        tempDoc.body.innerHTML = originHtml;
        $(tempDoc).find("img[data-latex]").replaceWith(function () {
            const latexStr = decodeURIComponent(this.getAttribute("data-latex"));
            try {
                return katex.renderToString(latexStr, {
                    throwOnError: true,
                    strict: false
                });
            } catch (e) {
                console.error("failed to render math expression (latex), fallback to image.", e);
                return this;
            }
        });
        return tempDoc.body.innerHTML;
    }

    var param = querystring.parse(window.location.search.substr(1));
    var paperId = param.paperId as string;

    var info = await zhixue.getPaperAnalysis(await TokenManager.getToken(), await TokenManager.getChildId(), paperId);
    if (info.errorCode) {
        alert("(code: " + info.errorCode + ")" + info.errorInfo);
        return;
    }
    if (info.result.length == 0) {
        var templateNoAnalysisContent = document.querySelector<HTMLTemplateElement>("#template-no-analysis").content;
        var node = document.importNode(templateNoAnalysisContent, true);
        $("#list-question").append(node);
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

            $(node).find(".question-content").html(processHtmlContent(question.standardAnswerHtml));
            $(node).find(".dropdown-content-type-button").text($(node).find(".dropdown-item-standardAnswer").text());

            $(node).find(".dropdown-item").on("click", (e) => {
                e.preventDefault();
                var root = $(e.target).parents(".question-analysis");
                var originHtml = question[$(e.target).attr("x-data-name")];
                root.find(".question-content").html(processHtmlContent(originHtml));
                root.find(".dropdown-content-type-button").text($(e.target).text());
            });
            $("#list-question").append(node);
        }
    }
});

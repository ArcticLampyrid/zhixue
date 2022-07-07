import { zhixue } from "../server/zhixue";
import { TokenManager } from "./TokenManager";
import * as querystring from 'querystring';
import * as Sugar from 'sugar';

declare global {
    var Chart: typeof import('chart.js');
    var ChartDataLabels: any
}

$(async () => {
    var param = querystring.parse(window.location.search.substr(1));
    var examId = param.examId as string;

    var info = await zhixue.getExemInfo(await TokenManager.getToken(), await TokenManager.getChildId(), examId);
    if (info.errorCode) {
        alert(info.errorCode);
        return;
    }

    var templateContent = document.querySelector<HTMLTemplateElement>("#template-paper").content;
    for (let paper of info.result.paperList) {
        var node = document.importNode(templateContent, true);
        $(node).find(".subject-details").attr("x-zx-paperId", paper.id);
        $(node).find(".subject-name").text(paper.subjectName);
        $(node).find(".paper-userScore").text(paper.userScore);
        $(node).find(".paper-standardScore").text(paper.standardScore);
        var paperPercentage = paper.userScore / paper.standardScore * 100;
        $(node).find(".paper-percentage").text(Sugar.Number.format(Sugar.Number.round(paperPercentage, 2), 2) + "%");
        $(node).find(".paper-score-progress").width(paperPercentage.toString() + "%");
        $(node).find(".paper-viewStudentAnswer").on("click", async e => {
            var studentAnserInfo = await zhixue.getStudentAnswerUrl(await TokenManager.getToken(), await TokenManager.getChildId(), paper.id, examId);
            window.open(studentAnserInfo.result);
        });
        $(node).find(".paper-viewQuestionAnalysis").attr("href", "paper_analysis.html?paperId=" + paper.id);
        $("#list-paper").append(node);
    }

    var examUserScore = Sugar.Array.sum(info.result.paperList, x => x.userScore);
    var examStandardScore = Sugar.Array.sum(info.result.paperList, x => x.standardScore);
    var examPercentage = examUserScore / examStandardScore * 100;
    if (info.result.paperList.length > 1) {
        $("#conclusion").removeClass("d-none");
        $("#exam-userScore").text(examUserScore);
        $("#exam-standardScore").text(examStandardScore);
        $("#exam-percentage").text(Sugar.Number.format(Sugar.Number.round(examPercentage, 2), 2) + "%");
        $("#exam-score-progress").width(examPercentage.toString() + "%");

        var chartLabels = info.result.paperList.map(x => x.subjectName);
        var chartDataValue = info.result.paperList.map(x => x.userScore / x.standardScore * 100);
        new Chart(document.getElementById("radarChart") as HTMLCanvasElement, {
            type: 'radar',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        label: "",
                        data: chartDataValue,
                        fill: true,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgb(54, 162, 235)",
                        pointBackgroundColor: "rgb(54, 162, 235)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgb(54, 162, 235)"
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        label: x => Sugar.Number.format(Sugar.Number.round(x.yLabel as number, 2), 2) + "%",
                        title: () => null,
                    }
                },
                scale: {
                    ticks: {
                        min: 0,
                        max: 100,
                        callback: x => x + "%"
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        });

        new Chart(document.getElementById("barChart") as HTMLCanvasElement, {
            plugins: [ChartDataLabels],
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        label: "",
                        data: chartDataValue,
                        fill: true,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)'
                        ],
                        borderColor: "rgb(54, 162, 235)",
                        pointBackgroundColor: "rgb(54, 162, 235)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgb(54, 162, 235)"
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        label: (x) => info.result.paperList[x.index].userScore
                            + " (" + Sugar.Number.format(Sugar.Number.round(x.yLabel as number, 2), 2) + "%)",
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
                            callback: x => x + "%"
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        formatter: (value, context) => info.result.paperList[context.dataIndex].userScore,
                        align: "start",
                        anchor: "end",
                    }
                }
            }
        });
        $("#chart-save-button").click(() => {
            var ctx = document.querySelector("#chart-tab-content .active canvas") as HTMLCanvasElement;
            $("#chart-save-button").attr("href", ctx.toDataURL("image/png"));
        })
    }
});

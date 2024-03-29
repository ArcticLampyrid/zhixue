import { TokenManager } from "./TokenManager";
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as $ from 'jquery';
import 'bootstrap';
$(async () => {
    var param = new URLSearchParams(window.location.search.substring(1));
    var examId = param.get("examId") as string;

    var info = await zhixue.getExemInfo(await TokenManager.getToken(), await TokenManager.getChildId(), examId);
    if (info.errorCode) {
        alert("(code: " + info.errorCode + ")" + info.errorInfo);
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
        $(node).find(".paper-percentage").text(paperPercentage.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%");
        $(node).find(".paper-score-progress").width(paperPercentage.toString() + "%");
        $(node).find(".paper-viewStudentAnswer").on("click", async e => {
            var studentAnserInfo = await zhixue.getStudentAnswerUrl(await TokenManager.getToken(), await TokenManager.getChildId(), paper.id, examId);
            window.open(studentAnserInfo.result);
        });
        $(node).find(".paper-viewQuestionAnalysis").attr("href", "paper_analysis.html?paperId=" + paper.id);
        $("#list-paper").append(node);
    }
    var examUserScore = info.result.paperList.reduce((r, x) => r + x.userScore, 0);
    var examStandardScore = info.result.paperList.reduce((r, x) => r + x.standardScore, 0);
    var examPercentage = examUserScore / examStandardScore * 100;
    if (info.result.paperList.length > 1) {
        $("#conclusion").removeClass("d-none");
        $("#exam-userScore").text(examUserScore);
        $("#exam-standardScore").text(examStandardScore);
        $("#exam-percentage").text(examPercentage.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%");
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
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: x => `${x}%`
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: x => chartDataValue[x.dataIndex].toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%",
                            title: () => null,
                        }
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
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: x => `${x}%`
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (x) => info.result.paperList[x.dataIndex].userScore
                                + " (" + chartDataValue[x.dataIndex].toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%)",
                        }
                    },
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

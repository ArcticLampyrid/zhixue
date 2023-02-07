import fetch, { Headers } from 'node-fetch';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { v1 as uuid_v1 } from 'uuid';
import { URLSearchParams } from 'url'

export module zhixue {
    export interface ApiResult {
        errorCode: number,
        errorInfo: string,
        result?: any
    }
    export interface StudentAnswerUrlResult extends ApiResult {
        result?: string
    }
    export interface LoginResult extends ApiResult {
        result?: {
            token: string,
            childId: string
            user: {
                name: string
                avatar: string
                code: string
            },
            class: {
                name: string
            },
            school: {
                name: string
            }
        }
    }
    export interface ExamBasicInfo {
        createDate: Date
        id: string,
        name: string,
        isFinal: boolean
    }
    export interface GetExamListResult extends ApiResult {
        result?: {
            examList: ExamBasicInfo[],
            hasNextPage: boolean
        }
    }
    export interface PaperBasicInfo {
        id: string,
        name: string,
        userScore: number,
        standardScore: number
        subjectName: string
    }
    export interface ExamReportResult extends ApiResult {
        result?: {
            paperList: PaperBasicInfo[],
        }
    }
    export interface QuestionAnalysis {
        isCorrect: boolean,
        title: string,
        userScore: number,
        standardScore: number,
        standardAnswerHtml: string,
        userAnswerHtml: string,
        contentHtml: string,
        analysisHtml: string
    }
    export interface QuestionGroupInfo {
        questions: QuestionAnalysis[]
    }
    export interface PaperAnalysis extends ApiResult {
        result?: QuestionGroupInfo[]
    }
    export interface LevelRuleInfo {
        lowBound: number,
        upperBound: number,
        name: string,
        childLevel?: LevelRuleInfo[]
    }
    export interface PaperLevelInfo {
        id: string,
        name: string,
        level: string
    }
    export interface PaperTrendInfo {
        data: PaperLevelInfo[],
        tag: {
            code: string,
            name: string
        }
    }
    export interface LevelTrendResult extends ApiResult {
        result?: {
            levelRule: LevelRuleInfo[]
            list: PaperTrendInfo[]
        }
    }
    function encodePassword(password: string): string {
        var cipher = crypto.createCipheriv("rc4", "iflytek_pass_edp", "");
        var crypted = cipher.update(password, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
    }
    function getAuthHeader(): Headers {
        const headers = new Headers();
        var authguid = uuid_v1()
        var authtimestamp = new Date().getTime().toString()
        var authbizcode = "0001"
        var authtoken = crypto.createHash("md5").update(authguid + authtimestamp + "iflytek!@#123student").digest("hex")
        headers.append("authguid", authguid);
        headers.append("authtimestamp", authtimestamp)
        headers.append("authtoken", authtoken);
        headers.append("authbizcode", authbizcode)
        return headers;
    }
    export async function login(username: string, password: string): Promise<LoginResult> {
        try {
            if ((username || "").trim() == "" || (password || "").trim() == "") {
                return {
                    errorCode: 1002,
                    errorInfo: "帐号或密码错误"
                };
            }

            var encodedPassword = encodePassword(password);
            var data = querystring.stringify({
                "loginName": username,
                "password": encodedPassword,
                "description": JSON.stringify({
                    "encrypt": ["password"]
                })
            });
            var response = await fetch("https://www.zhixue.com/container/app/parWeakCheckLogin?" + data)
            var body = await response.json() as any
            if (body.errorCode) {
                return {
                    errorCode: body.errorCode,
                    errorInfo: body.errorInfo
                };
            }
            return {
                errorCode: 0,
                errorInfo: "操作成功",
                result: {
                    token: body.result.token,
                    childId: body.result.id,
                    user: {
                        name: body.result.name,
                        avatar: body.result.userInfo.avatar,
                        code: body.result.userInfo.code
                    },
                    class: {
                        name: body.result.clazzInfo.name
                    },
                    school: {
                        name: body.result.userInfo.school.schoolName
                    }
                }
            };
        } catch (error) {
            return {
                errorCode: -1,
                errorInfo: "发送请求失败：" + (error.message || "未知错误")
            };
        }
    }
    export async function getExemList(token: string, childId: string, pageIndex: number, pageSize: number, reportType: string = "exam"): Promise<GetExamListResult> {
        try {
            var data = new URLSearchParams({
                "actualPosition": '0',
                "childId": childId,
                "pageIndex": pageIndex.toString(),
                "pageSize": pageSize.toString(),
                "reportType": reportType,
                "token": token
            });
            var response = await fetch("https://www.zhixue.com/zhixuebao/report/getPageExamList", {
                method: "post",
                body: data,
                headers: getAuthHeader()
            })
            var body = await response.json() as any
            if (body.errorCode) {
                return {
                    errorCode: body.errorCode,
                    errorInfo: body.errorInfo
                };
            }
            return {
                errorCode: 0,
                errorInfo: "操作成功",
                result: {
                    examList: (body.result.examInfoList as Array<any>).map<ExamBasicInfo>(x => {
                        return {
                            createDate: new Date(x.examCreateDateTime),
                            name: x.examName,
                            id: x.examId,
                            isFinal: x.isFinal
                        }
                    }),
                    hasNextPage: body.result.hasNextPage
                }
            };
        } catch (error) {
            return {
                errorCode: -1,
                errorInfo: "发送请求失败：" + (error.message || "未知错误")
            };
        }
    }

    export async function getExemInfo(token: string, childId: string, examId: string): Promise<ExamReportResult> {
        try {
            var data = new URLSearchParams({
                "childId": childId,
                "examId": examId,
                "token": token
            });
            var response = await fetch("https://www.zhixue.com/zhixuebao/report/exam/getReportMain", {
                method: "post",
                body: data,
                headers: getAuthHeader()
            })
            var body = await response.json() as any
            if (body.errorCode) {
                return {
                    errorCode: body.errorCode,
                    errorInfo: body.errorInfo
                };
            }
            return {
                errorCode: 0,
                errorInfo: "操作成功",
                result: {
                    paperList: (body.result.paperList as Array<any>).map<PaperBasicInfo>(x => {
                        return {
                            id: x.paperId,
                            name: x.paperName,
                            userScore: x.userScore,
                            standardScore: x.standardScore,
                            subjectName: x.subjectName
                        }
                    }),
                }
            };
        } catch (error) {
            return {
                errorCode: -1,
                errorInfo: "发送请求失败：" + (error.message || "未知错误")
            };
        }
    }

    export async function getLevelTrend(token: string, childId: string, examId: string, paperId: string): Promise<LevelTrendResult> {
        try {
            var data = querystring.stringify({
                "examId": examId,
                "paperId": paperId,
                "pageIndex": 1,
                "pageSize": 5,
                "childId": childId,
                "token": token
            });
            var response = await fetch("https://www.zhixue.com/zhixuebao/report/paper/getLevelTrend?" + data, {
                headers: getAuthHeader()
            })
            var body = await response.json() as any
            if (body.errorCode) {
                return {
                    errorCode: body.errorCode,
                    errorInfo: body.errorInfo
                };
            }
            return {
                errorCode: 0,
                errorInfo: "操作成功",
                result: {
                    levelRule: body.result.levelList as Array<LevelRuleInfo>,
                    list: (body.result.list as Array<any>).map<PaperTrendInfo>(x => {
                        return {
                            tag: {
                                code: x.tag.code,
                                name: x.tag.name
                            },
                            data: (x.dataList as Array<any>).map<PaperLevelInfo>(info => {
                                return {
                                    id: info.id,
                                    name: info.name,
                                    level: info.level
                                }
                            })
                        }
                    })
                }
            };
        } catch (error) {
            return {
                errorCode: -1,
                errorInfo: "发送请求失败：" + (error.message || "未知错误")
            };
        }
    }

    export async function getStudentAnswerUrl(token: string, childId: string, paperId: string, examId:string): Promise<StudentAnswerUrlResult> {
        var data = {
            "userId": childId,
            "token": token,
            "paperId": paperId,
            "examId" : examId
        };
        return {
            errorCode: 0,
            errorInfo: "操作成功",
            result: "https://www.zhixue.com/studentanswer/index.html?" + querystring.stringify(data)
        };
    }

    export async function getPaperAnalysis(token: string, childId: string, paperId: string): Promise<PaperAnalysis> {
        try {
            var data = querystring.stringify({
                "childId": childId,
                "paperId": paperId,
                "token": token
            });       
            var response = await fetch("https://www.zhixue.com/zhixuebao/report/getPaperAnalysis?" + data, {
                headers: getAuthHeader()
            })
            var body = await response.json() as any
            if (body.errorCode) {
                return {
                    errorCode: body.errorCode,
                    errorInfo: body.errorInfo
                };
            }
            var analysisResults = JSON.parse(body.result)
            return {
                errorCode: 0,
                errorInfo: "操作成功",
                result: (analysisResults.typeTopicAnalysis as Array<any>).map<QuestionGroupInfo>(x => {
                    return {
                        questions: (x.topicAnalysisDTOs as Array<any>).map<QuestionAnalysis>(item => {
                            var standardAnswerHtml = "略";
                            if (item.answerHtml && item.answerHtml != "略") {
                                standardAnswerHtml = item.answerHtml;
                            }
                            else if (item.standardAnswer) {
                                standardAnswerHtml = item.standardAnswer;
                                if (item.answerType == "s02Image") {
                                    standardAnswerHtml = "<img src=\"" + standardAnswerHtml + "\" />";
                                }
                            }

                            var userAnswerHtml: string = "略";
                            if (item.userAnswer) {
                                userAnswerHtml = item.userAnswer;
                            }
                            else if (item.imageAnswer) {
                                userAnswerHtml = (JSON.parse(item.imageAnswer) as Array<string>).map(x => {
                                    return "<img src=\"" + x + "\" />"
                                }).join("");
                            }

                            return {
                                title: item.disTitleNumber,
                                isCorrect: item.isCorrect,
                                userScore: item.score,
                                standardScore: item.standardScore,
                                standardAnswerHtml: standardAnswerHtml,
                                userAnswerHtml: userAnswerHtml,
                                contentHtml: item.contentHtml || "略",
                                analysisHtml: item.analysisHtml || "略"
                            }
                        })
                    };
                })
            };
        } catch (error) {
            return {
                errorCode: -1,
                errorInfo: "发送请求失败：" + (error.message || "未知错误")
            };
        }
    }
}
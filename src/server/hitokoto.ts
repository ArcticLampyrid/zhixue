import * as request from 'request-promise-native';
export interface HitokotoResult {
    id: number,
    hitokoto: string,
    type: string,
    from: string,
    creator: string,
    created_at: string
}

export async function hitokoto(c?: string): Promise<HitokotoResult> {
    return JSON.parse(await request.get("https://v1.hitokoto.cn/?" +
        (c ? "c=" + c : "")));
}

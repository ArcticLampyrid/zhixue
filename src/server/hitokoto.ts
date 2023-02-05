import fetch from 'node-fetch';
export interface HitokotoResult {
    id: number,
    hitokoto: string,
    type: string,
    from: string,
    creator: string,
    created_at: string
}

export async function hitokoto(c?: string): Promise<HitokotoResult> {
    const response = await fetch("https://v1.hitokoto.cn/?" + (c ? "c=" + c : ""));
    return (await response.json()) as HitokotoResult;
}

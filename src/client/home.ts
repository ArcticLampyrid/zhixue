import { hitokoto } from "../server/hitokoto";
async function updateHitokoto() {
    var info = await hitokoto();
    $("#hitokoto").text(info.hitokoto)
}
$(() => {
    updateHitokoto();
    $("#updateHitokoto").on("click", updateHitokoto);
});
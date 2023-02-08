import { hitokoto } from "../server/hitokoto";
async function updateHitokoto() {
    var info = await hitokoto();
    $("#hitokoto").text(info.hitokoto)
}
$(() => {
    $(".lamp-switch-sakura-img").on("click", () => {
        $(".lamp-switch-select-container").css("animation", "lamp-switch-sakura-switch .5s steps(60) none");
        $(".lamp-switch-select-container").on("animationend", () => {
            $(".lamp-switch-select-container").css("animation", "none");
        });

        let oldTheme = window.top.document.documentElement.getAttribute("data-bs-theme") || "light";
        let invertTheme = {
            "light": "dark",
            "dark": "light"
        }
        let newTheme = invertTheme[oldTheme] || "light";
        localStorage.setItem("theme", newTheme);
        window.top.document.documentElement.setAttribute("data-bs-theme", newTheme);
    });
    updateHitokoto();
    $("#updateHitokoto").on("click", updateHitokoto);
});
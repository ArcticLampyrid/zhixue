import { Titlebar, Color } from 'custom-electron-titlebar'
if (self == top) {
    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            new Titlebar({
                backgroundColor: Color.LIGHTGREY,
                menu: null,
                titleHorizontalAlignment: "left"
            });
        }
    };
}

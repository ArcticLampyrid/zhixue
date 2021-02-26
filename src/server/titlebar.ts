import { Titlebar, Color } from 'custom-electron-titlebar'
if (process.isMainFrame) {
    document.addEventListener('readystatechange', () => {
        if (document.readyState == "interactive") {
            new Titlebar({
                backgroundColor: Color.LIGHTGREY,
                menu: null,
                titleHorizontalAlignment: "left"
            });
        }
    });
}

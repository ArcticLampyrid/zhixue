import { Titlebar, TitlebarColor } from 'custom-electron-titlebar'
import { zhixue } from './zhixue'
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('openDevTools', (params: any) => {
    ipcRenderer.send('open-dev-tools', params);
});
contextBridge.exposeInMainWorld('zhixue', zhixue);
if (process.isMainFrame) {
    document.addEventListener('readystatechange', () => {
        if (document.readyState == "interactive") {
            const getTitleBarBgColorHex = () => {
                const bgColorHex = getComputedStyle(document.documentElement).getPropertyValue("--zx-bar-bg-color").trim();
                return TitlebarColor.fromHex(bgColorHex);
            }
            const titleBar = new Titlebar({
                titleHorizontalAlignment: "left",
                backgroundColor: getTitleBarBgColorHex()
            });
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === "attributes" && mutation.attributeName === "data-bs-theme") {
                        titleBar.updateBackground(getTitleBarBgColorHex());
                    }
                });
            });
            observer.observe(window.top.document.documentElement, {
                attributes: true,
                attributeFilter: ["data-bs-theme"]
            });
        }
    });
}

(() => {
    const addAnimation = () => {
        // This should be called after theme initialization
        const style = document.createElement('style')
        style.innerHTML = `
        * {
            transition: background .5s;
        }
        `
        document.head.appendChild(style);
    }
    if (window === window.top) {
        document.documentElement.setAttribute("data-bs-theme", localStorage.getItem("theme") || "light");
        addAnimation();
        return;
    }
    document.documentElement.setAttribute("data-bs-theme",
        window.top.document.documentElement.getAttribute("data-bs-theme"));
    addAnimation();

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "attributes" && mutation.attributeName === "data-bs-theme") {
                document.documentElement.setAttribute("data-bs-theme",
                    window.top.document.documentElement.getAttribute("data-bs-theme"));
            }
        });
    });
    observer.observe(window.top.document.documentElement, {
        attributes: true,
        attributeFilter: ["data-bs-theme"]
    });
})();

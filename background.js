function openPomodoroWindow() {
    chrome.windows.getCurrent(function (currentWindow) {
        let browserLeft = currentWindow.left;
        let browserTop = currentWindow.top;
        let browserWidth = currentWindow.width;
        let windowWidth = 500;
        let windowHeight = 275;
        let leftPos = Math.max(0, browserLeft + browserWidth - windowWidth - 50); 
        let topPos = Math.max(0, browserTop + 80); 
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: windowWidth,
            height: windowHeight,
            left: Math.round(leftPos),
            top: Math.round(topPos),
            focused: true
        });
    });
}

chrome.action.onClicked.addListener(openPomodoroWindow);

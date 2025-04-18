let workDuration = 25 * 60, shortBreak = 5 * 60, longBreak = 15 * 60;

let timeLeft = workDuration;
let timer = null;
let isRunning = false;
let lastUpdated = 0;
let isBreak = false;

let startButton = document.getElementById("start");
let pauseButton = document.getElementById("pause");
let resetButton = document.getElementById("reset");
let timerDisplay = document.getElementById("timerDisplay");
let sessionLabel = document.getElementById("sessionLabel");
let sessionCounter = document.getElementById("sessionCounter");

let totalSessions = 4;
let current = 1;

function updateTime() {
    let seconds = timeLeft % 60;
    let minutes = Math.floor(timeLeft / 60);
    let timeString;
    if (seconds < 10) {
        timeString = minutes + ":0" + seconds;
    } else {
        timeString = minutes + ":" + seconds;
    }
    console.log(timeString);
    if (timeLeft <= 0) {
        timerDisplay.textContent = "00:00";
    } else {
        timerDisplay.textContent = timeString; 
    }
}

function updateSession() {
    if (current > totalSessions) {
        sessionCounter.textContent = "Good job, you've completed a full Pomodoro cycle!";
    } else {
        sessionCounter.textContent = `Session ${current} of ${totalSessions}`;
    }
}

function stopBlinking() {
    timerDisplay.classList.remove("blink");
}

function updateTimer() {
    let now = Date.now();
    let elapsedTime = Math.floor((now - lastUpdated) / 1000);
    elapsedTime = Math.max(elapsedTime, 1);
    lastUpdated = now;
    timeLeft -= elapsedTime;
    if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        isRunning = false;
        if (isBreak) {
            current++;
            if (current > totalSessions) {
                timerDisplay.textContent = "00:00";
                timerDisplay.classList.add("blink");
                sessionLabel.textContent = "Cycle complete :)";
                sessionCounter.textContent = "Good job, you've completed a full Pomodoro cycle!";
                return;
            }
            timeLeft = workDuration;
            sessionLabel.textContent = "Work session!";
            updateSession();
            isBreak = false;
        } else {
            if (current % totalSessions === 0) {
                timeLeft = longBreak;
                sessionLabel.textContent = "Long break :)";
            } else {
                timeLeft = shortBreak;
                sessionLabel.textContent = "Short break :)";
            }
            isBreak = true;
        }
        setTimeout(startTimer, 1000);
    }
    updateTime();
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        lastUpdated = Date.now();
        if (!isBreak) {
            sessionLabel.textContent = "Work session!";
        }
        if (timer !== null) {
            clearInterval(timer);
        }
        timer = setInterval(updateTimer, 1000);
        startButton.textContent = "Start";
    }
}

function pauseTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
        isRunning = false;
        console.log("Timer paused.");
        startButton.textContent = "Resume ";

    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    current = 1;
    isBreak = false;
    timeLeft = workDuration;
    sessionLabel.textContent = "Start your focus sessions!";
    sessionCounter.textContent = "Session 1 of " + totalSessions;
    timerDisplay.classList.remove("blink");
    updateTime();
    startButton.textContent = "Start";
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

updateTime();

function openToDoList() {
    let windowWidth = 600; 
    let windowHeight = 600; 
    let leftPos = Math.round((screen.availWidth - windowWidth) / 2);
    let topPos = Math.round((screen.availHeight - windowHeight) / 2);
    chrome.windows.create({
        url: chrome.runtime.getURL("todo.html"),
        type: "popup",
        width: windowWidth,
        height: windowHeight,
        left: leftPos,
        top: topPos,
        focused: true
    });
}

var todoButton = document.getElementById("todoButton");

if (todoButton) {
    todoButton.addEventListener("click", openToDoList);
}

function openVideoWindow() {
    let windowWidth = 480;
    let windowHeight = 350;
    let leftPos = Math.round((screen.availWidth - windowWidth) / 2);
    let topPos = Math.round((screen.availHeight - windowHeight) / 2);
    chrome.windows.create({
        url: chrome.runtime.getURL("video.html"),
        type: "popup",
        width: windowWidth,
        height: windowHeight,
        left: leftPos,
        top: topPos,
        focused: true
    });
}

var videoButton = document.getElementById("videoButton");

if (videoButton) {
    videoButton.addEventListener("click", openVideoWindow);
}

document.getElementById("helpButton").addEventListener("click", () => {
    let windowWidth = 600;
    let windowHeight = 350;
    let leftPos = Math.round((screen.availWidth - windowWidth) / 2);
    let topPos = Math.round((screen.availHeight - windowHeight) / 2);
    chrome.windows.create({
        url: chrome.runtime.getURL("help.html"),
        type: "popup",
        width: windowWidth,
        height: windowHeight,
        left: leftPos,
        top: topPos,
        focused: true
    });
});


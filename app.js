(function () {
  "use strict";
  var WORK_SECONDS = 25 * 60;
  var BREAK_SECONDS = 5 * 60;
  var mode = "work";
  var remainingSeconds = WORK_SECONDS;
  var endTime = null;
  var intervalId = null;
  var timeDisplay = document.getElementById("time-display");
  var modeLabel = document.getElementById("mode-label");
  var statusLabel = document.getElementById("status-label");
  var hint = document.getElementById("hint");
  var startPauseButton = document.getElementById("start-pause-button");
  var resetButton = document.getElementById("reset-button");

  function formatTime(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    var seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return minutes + ":" + seconds;
  }

  function updateView() {
    timeDisplay.textContent = formatTime(remainingSeconds);
    modeLabel.textContent = mode === "work" ? "工作时间" : "休息时间";
    modeLabel.classList.toggle("break-mode", mode === "break");
    if (intervalId !== null) {
      statusLabel.textContent = "进行中";
      startPauseButton.textContent = "暂停";
      hint.textContent = mode === "work" ? "专注完成后进入 5 分钟休息" : "休息结束后回到工作时间";
    } else if (remainingSeconds === 0) {
      statusLabel.textContent = "已完成";
      startPauseButton.textContent = "开始";
    } else if (remainingSeconds === (mode === "work" ? WORK_SECONDS : BREAK_SECONDS)) {
      statusLabel.textContent = "准备开始";
      startPauseButton.textContent = "开始";
      hint.textContent = "准备好后开始";
    } else {
      statusLabel.textContent = "已暂停";
      startPauseButton.textContent = "继续";
      hint.textContent = "计时已暂停";
    }
  }

  function stopTicker() {
    if (intervalId !== null) { window.clearInterval(intervalId); intervalId = null; }
  }

  function switchMode() {
    mode = mode === "work" ? "break" : "work";
    remainingSeconds = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
    endTime = null;
  }

  function tick() {
    if (endTime === null) return;
    remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    if (remainingSeconds === 0) { stopTicker(); switchMode(); }
    updateView();
  }

  function startTimer() {
    if (remainingSeconds === 0) switchMode();
    endTime = Date.now() + remainingSeconds * 1000;
    intervalId = window.setInterval(tick, 250);
    tick();
  }

  function pauseTimer() {
    tick();
    stopTicker();
    endTime = null;
    updateView();
  }

  function resetTimer() {
    stopTicker();
    mode = "work";
    remainingSeconds = WORK_SECONDS;
    endTime = null;
    updateView();
  }

  startPauseButton.addEventListener("click", function () {
    if (intervalId === null) startTimer(); else pauseTimer();
  });
  resetButton.addEventListener("click", resetTimer);
  updateView();
})();

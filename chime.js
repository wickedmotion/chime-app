// Chime sound file paths (kept only for non-voice sounds) Replace anything if you know what you're doing!
const soundFiles = {
    "simple": "sounds/simple-bleep.mp3",  // Replace with own sound sample
    "bell": "sounds/bell.mp3",  // Replace with own sound sample
    "default voice": "voice"
};

const intervals = [0.25, 5, 10, 15, 30, 60]; // in minutes
const startTimes = ["1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 am", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm", "12 pm"];
const endTimes = ["1 am", "2 am", "3 am", "4 am", "5 am", "6 am", "7 am", "8 am", "9 am", "10 am", "11 am", "12 am", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm", "12 pm"];

// User preferences (default sound and interval)
let soundType = "default voice";
let intervalIndex = 5;
let intervalMinutes = intervals[intervalIndex];
let startTimeIndex = 0;
let endTimeIndex = 23;
let isChimeOn = true;
let countdownTimer;

// Function to play the chime sound and announce the current time after the sound
function playChime() {
    if (!isChimeOn) return;

    const currentTime = new Date();
    const { hour, isAM } = getHourAndPeriod();

    const startTime = new Date();
    const endTime = new Date();

    // Set the hours for start and end times without modifying the current date
    startTime.setHours(startTimeIndex + 1, 0, 0, 0);
    endTime.setHours(endTimeIndex + 13, 0, 0, 0); 

    // Compare times using getTime() for precision
    if (currentTime.getTime() >= startTime.getTime() && currentTime.getTime() <= endTime.getTime()) {
        if (soundType === "default voice") {
            // Use SpeechSynthesis to announce the current time
            announceCurrentTime();
        } else {
            // Play simple or bell chime
            let audio = new Audio(soundFiles[soundType]);
            audio.play();
        }
    }
}

// Function to announce the current time using the SpeechSynthesis API
function announceCurrentTime() {
    const now = new Date();
    const { hour, isAM } = getHourAndPeriod();
    const minutes = now.getMinutes();
    
    const period = isAM ? "A.M." : "P.M.";
    const minutesText = minutes === 0 ? "o'clock" : `${minutes} minutes`;
    
    // Text to be spoken, including minutes
    const timeText = `The time is ${numberToWord(hour)} ${minutesText} ${period}`;
    
    // Create a new SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(timeText);
    utterance.voice = getEnglishVoice();

    // Speak the utterance
    window.speechSynthesis.speak(utterance);
}

// Function to announce current settings
function announceSettings() {
    const intervalText = `The current interval is every ${intervals[intervalIndex]} minutes.`;
    const soundText = `The current sound setting is ${soundType}.`;
    const startText = `The chime starts at ${startTimes[startTimeIndex]}.`;
    const endText = `The chime ends at ${endTimes[endTimeIndex]}.`;
    
    // Combine all settings into one message
    const settingsText = `${intervalText} ${soundText} ${startText} ${endText}`;

    // Create a new SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(settingsText);
    utterance.voice = getEnglishVoice();
    window.speechSynthesis.speak(utterance);
}

// Utility function to get the current hour (in 12-hour format) and whether it's AM or PM
function getHourAndPeriod() {
    const currentHour = new Date().getHours();
    const hour = currentHour % 12 === 0 ? 12 : currentHour % 12; // Convert to 12-hour format
    const isAM = currentHour < 12; // Before 12 PM is AM, after is PM
    return { hour, isAM };
}

// Utility function to convert number to word (for voice announcements)
function numberToWord(number) {
    const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
    return words[number - 1];
}

// Function to set the chime interval
function setChimeInterval(minutes) {
    clearInterval(window.chimeInterval);
    clearInterval(countdownTimer);

    if (!isChimeOn) return;

    const intervalInSeconds = minutes * 60;
    let remainingTime = intervalInSeconds;

    // Announce the countdown duration the first time it's set
    if (minutes === 0.25) {
        const countdownText = `Countdown set to ${minutes * 60} seconds`;
        const countdownUtterance = new SpeechSynthesisUtterance(countdownText);
        countdownUtterance.voice = getEnglishVoice();
        window.speechSynthesis.speak(countdownUtterance);
    }

    countdownTimer = setInterval(() => {
        remainingTime--;
 console.log(`${remainingTime}`);
        if (remainingTime <= 0) {
            remainingTime = intervalInSeconds;
        }
    }, 1000);
    window.chimeInterval = setInterval(playChime, minutes * 60 * 1000);
}

// Function to toggle the chime on and off and disable settings when off
function toggleChime() {
    isChimeOn = !isChimeOn;

    const bellIcon = document.getElementById('bell-icon');
    const settings = document.querySelectorAll('.setting:not(.toggle), .label');
    
    if (isChimeOn) {
        setChimeInterval(intervals[intervalIndex]);
        document.getElementById('on-toggle').classList.add('active');
        document.getElementById('off-toggle').classList.remove('active');
        
        bellIcon.innerText = '🔔';
        bellIcon.style.opacity = '1';

        settings.forEach(setting => {
            setting.classList.remove('disabled');
        });

        // Announce that chime is turned ON
        const onText = "The chime is now ON.";
        const utterance = new SpeechSynthesisUtterance(onText);
        utterance.voice = getEnglishVoice();
        window.speechSynthesis.speak(utterance);
    } else {
        clearInterval(window.chimeInterval);
        clearInterval(countdownTimer);
        document.getElementById('on-toggle').classList.remove('active');
        document.getElementById('off-toggle').classList.add('active');
        
        bellIcon.innerText = '🔕';
        bellIcon.style.opacity = '0.5';

        settings.forEach(setting => {
            setting.classList.add('disabled');
        });

        // Announce that chime is turned OFF
        const offText = "The chime is now OFF.";
        const utterance = new SpeechSynthesisUtterance(offText);
        utterance.voice = getEnglishVoice();
        window.speechSynthesis.speak(utterance);
    }
}

// Cycle through sound options and play a preview
function cycleSound() {
    const sounds = Object.keys(soundFiles);
    let currentIndex = sounds.indexOf(soundType);
    currentIndex = (currentIndex + 1) % sounds.length;
    soundType = sounds[currentIndex];
    document.getElementById('sound-choice').innerText = soundType + " beep";
    
    // Announce the current sound setting
    announceCurrentSoundSetting();
    
    const previewAudio = new Audio(soundFiles[soundType]);
    previewAudio.play();
}

// Function to announce the current sound setting
function announceCurrentSoundSetting() {
    window.speechSynthesis.cancel();
    const soundText = `The current sound setting is now ${soundType}.`;
    const utterance = new SpeechSynthesisUtterance(soundText);
    utterance.voice = getEnglishVoice();
    window.speechSynthesis.speak(utterance);
    
    console.log(`Announcing sound setting: ${soundText}`);
}

// Cycle through intervals (0.25 (for testing purposes), 5, 10, 15, 30, 60 minutes)
function cycleInterval() {
    if (!isChimeOn) return; 
    
    intervalIndex = (intervalIndex + 1) % intervals.length;
    document.getElementById('interval').innerText = `every ${intervals[intervalIndex]} minutes`;
    
    // Announce the new interval setting
    window.speechSynthesis.cancel();
    const intervalText = `The current interval is now every ${intervals[intervalIndex]} minutes.`;
    const utterance = new SpeechSynthesisUtterance(intervalText);
    utterance.voice = getEnglishVoice();
    window.speechSynthesis.speak(utterance);
    
    setChimeInterval(intervals[intervalIndex]);
}

// Cycle through start times
function cycleStartTime() {
    startTimeIndex = (startTimeIndex + 1) % startTimes.length;
    document.getElementById('start-time').innerText = startTimes[startTimeIndex];

    // Announce the new start time
    window.speechSynthesis.cancel();
    const startTimeText = `The chime now starts at ${startTimes[startTimeIndex]}.`;
    const utterance = new SpeechSynthesisUtterance(startTimeText);
    utterance.voice = getEnglishVoice();
    window.speechSynthesis.speak(utterance);
}

// Cycle through end times
function cycleEndTime() {
    endTimeIndex = (endTimeIndex + 1) % endTimes.length;
    document.getElementById('end-time').innerText = endTimes[endTimeIndex];

    // Announce the new end time
    window.speechSynthesis.cancel();
    const endTimeText = `The chime now ends at ${endTimes[endTimeIndex]}.`;
    const utterance = new SpeechSynthesisUtterance(endTimeText);
    utterance.voice = getEnglishVoice();
    window.speechSynthesis.speak(utterance);
}

// On load, set initial interval and start/end times and announce settings
window.onload = () => {
    let countdownDuration = 5;
    const countdownUtterance = new SpeechSynthesisUtterance(`Starting in ${countdownDuration} seconds`);
    countdownUtterance.voice = getEnglishVoice();
    window.speechSynthesis.speak(countdownUtterance);

    const countdownTimer = setInterval(() => {
        countdownDuration--;
        if (countdownDuration <= 0) {
            clearInterval(countdownTimer);
            announceCurrentTime();
            announceSettings();
            setChimeInterval(intervals[intervalIndex]); 
        }
    }, 1000);

    document.getElementById('start-time').innerText = startTimes[startTimeIndex];
    document.getElementById('end-time').innerText = endTimes[endTimeIndex];
    document.getElementById('sound-choice').innerText = soundType + " beep";
};

// Function to get an English voice from the speech synthesis
function getEnglishVoice() {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.lang === 'en-US');
}

let currentlyPlayingSounds = [];

let progressBarInterval;

function stopAllSounds() {
  currentlyPlayingSounds.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  currentlyPlayingSounds = [];

  // Reset and hide progress bar
  const progressBar = document.getElementById('audio-progress-bar');
  const container = document.getElementById('audio-progress-container');
  progressBar.style.width = "0%";
  container.style.display = "none";

  // Clear previous progress bar interval if any
  if (progressBarInterval) {
    clearInterval(progressBarInterval);
    progressBarInterval = null;
  }
}

function showAudioProgressBar(audioElement) {
  const progressBar = document.getElementById('audio-progress-bar');
  const container = document.getElementById('audio-progress-container');

  // Show and reset progress bar to full at start
  progressBar.style.width = "100%";
  container.style.display = "block";

  // Clear any existing interval to avoid overlap
  if (progressBarInterval) {
    clearInterval(progressBarInterval);
  }

  progressBarInterval = setInterval(() => {
    if (audioElement.paused || audioElement.ended) {
      clearInterval(progressBarInterval);
      progressBarInterval = null;
      progressBar.style.width = "0%";
      container.style.display = "none";
    } else {
      const duration = audioElement.duration;
      const currentTime = audioElement.currentTime;
      if (duration > 0) {
        const progress = 1 - (audioElement.currentTime / audioElement.duration); // value from 1 to 0
        progressBar.style.transform = `scaleX(${progress})`;
      }
    }
  }, 100);
}

// Updated sound play functions with stop/reset + progress bar show
function playStartSound() {
  stopAllSounds();

  const startSound = new Audio("sounds/start-sound.wav"); // Replace with own sound sample
  currentlyPlayingSounds.push(startSound);
  startSound.play();
  showAudioProgressBar(startSound);
}

function playEndSound() {
  stopAllSounds();

  const endSound = new Audio("sounds/end-sound.wav"); // Replace with own sound sample
  currentlyPlayingSounds.push(endSound);
  endSound.play();
  showAudioProgressBar(endSound);
}

function playLongStartSound() {
  stopAllSounds();

  const longStartSound = new Audio("sounds/long-start-sound.wav"); // Replace with own sound sample
  currentlyPlayingSounds.push(longStartSound);
  longStartSound.play();
  showAudioProgressBar(longStartSound);
}

// Breaking News Ticker functionality
const newsTicker = document.getElementById('news-ticker');

newsTicker.addEventListener('click', () => {
  if (newsTicker.classList.contains('editing')) return;

  newsTicker.classList.add('editing');
  newsTicker.style.animation = 'scroll 20s linear infinite';

  // Replace text with input box
  const currentText = newsTicker.textContent;
  newsTicker.innerHTML = `<input type="text" id="ticker-input" value="${currentText}" />`;

  const input = document.getElementById('ticker-input');
  input.focus();
  input.select();

  // When input loses focus, save changes and restore ticker
  input.addEventListener('blur', () => {
    const newText = input.value.trim() || 'Breaking news: Click here to edit this text!';
    newsTicker.textContent = newText;
    newsTicker.classList.remove('editing');
    newsTicker.style.animation = '';
  });

  // Save on Enter key press
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
});
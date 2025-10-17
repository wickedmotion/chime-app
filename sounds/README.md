1. Download or Record your own sounds

2. Place your sounds in this sounds folder

3. Keep naming conventions of the sounds the same as mentioned in the chime.js file (see below naming conventions)

Naming Conventions:

- simple-bleep.mp3
- bell.mp3

- start-sound.wav // preferably to use a shorter sound
- end-sound.wav // personal vistory sound
- long-start-sound.wav // preferably to use a longer sound

When you do not replace these sounds with the right naming you get these errors in the console (Inspector in browser):

Announcing sound setting: The current sound setting is now simple.
GET file:///D:/Downloads_2024/Chime%20App/sounds/simple-bleep.mp3 net::ERR_FILE_NOT_FOUNDUnderstand this error
index.html:1 Uncaught (in promise) NotSupportedError: Failed to load because no supported source was found.Understand this error

Announcing sound setting: The current sound setting is now bell.
sounds/bell.mp3:1  GET file:///D:/Downloads_2024/Chime%20App/sounds/bell.mp3 net::ERR_FILE_NOT_FOUNDUnderstand this error
index.html:1 Uncaught (in promise) NotSupportedError: Failed to load because no supported source was found.

And for the buttons:

sounds/start-sound.wav:1  GET file:///D:/Downloads_2024/Chime%20App/sounds/start-sound.wav net::ERR_FILE_NOT_FOUNDUnderstand this error
index.html:1 Uncaught (in promise) NotSupportedError: Failed to load because no supported source was found.Understand this error

sounds/end-sound.wav:1  GET file:///D:/Downloads_2024/Chime%20App/sounds/end-sound.wav net::ERR_FILE_NOT_FOUNDUnderstand this error
index.html:1 Uncaught (in promise) NotSupportedError: Failed to load because no supported source was found.Understand this error

sounds/long-start-sound.wav:1  GET file:///D:/Downloads_2024/Chime%20App/sounds/long-start-sound.wav net::ERR_FILE_NOT_FOUNDUnderstand this error
index.html:1 Uncaught (in promise) NotSupportedError: Failed to load because no supported source was found.

HAVE FUN!!! Stay Focussed, Call up your motivation by audio and visual cues.


Kind regards, wickedmotion

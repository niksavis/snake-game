// Sound effects for the game
let eatSound, gameOverSound, moveSound;

// Function to initialize sound
function initSounds() {
    eatSound = new Audio('assets/eat.mp3');
    gameOverSound = new Audio('assets/game-over.mp3');
    moveSound = new Audio('assets/move.mp3');
    
    // Preload sounds
    eatSound.load();
    gameOverSound.load();
    moveSound.load();
    
    // Initialize sound settings
    initSoundSettings();
}

// Function to play sounds
function playSound(sound) {
    // Check if sound is enabled and sound is initialized
    if (sound && localStorage.getItem('soundEnabled') !== 'false') {
        try {
            sound.currentTime = 0;
            let playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Sound play prevented:', error);
                });
            }
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    }
}

// Add sound toggle functionality
function setupSoundControls() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
}

function toggleSound() {
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    localStorage.setItem('soundEnabled', !soundEnabled);
    
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.textContent = soundEnabled ? '🔇 Sound Off' : '🔊 Sound On';
    }
}

// Initialize sound setting
function initSoundSettings() {
    if (localStorage.getItem('soundEnabled') === null) {
        localStorage.setItem('soundEnabled', 'true');
    }
    
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.textContent = localStorage.getItem('soundEnabled') !== 'false' 
            ? '🔊 Sound On' 
            : '🔇 Sound Off';
    }
}

// Sound effects for the game
let eatSound, gameOverSound, moveSound, powerupSound, specialFoodSound;
let audioContext = null;

// Function to create a simple beep sound of specific frequency and duration
function createBeepSound(frequency, duration, type = 'sine', volume = 0.5) {
    try {
        // Create audio context if it doesn't exist
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create oscillator for the beep
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Set properties
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a simple audio element as a fallback
        const audio = new Audio();
        
        // Start the oscillator
        oscillator.start();
        
        // Stop the oscillator after the specified duration
        oscillator.stop(audioContext.currentTime + duration);
        
        // Return a promise that resolves when the beep is complete
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(audio);
            }, duration * 1000);
        });
    } catch (error) {
        console.error('Error creating beep sound:', error);
        // Return an empty audio element as a fallback
        return Promise.resolve(new Audio());
    }
}

// Function to initialize sounds using Web Audio API
async function initSounds() {
    try {
        // Create an empty audio element as a placeholder
        const createEmptyAudio = () => {
            const audio = new Audio();
            audio.volume = 0.5;
            return audio;
        };
        
        // Initialize placeholder audio elements
        eatSound = createEmptyAudio();
        gameOverSound = createEmptyAudio();
        moveSound = createEmptyAudio();
        powerupSound = createEmptyAudio();
        specialFoodSound = createEmptyAudio();
        
        // Create the AudioContext for Web Audio API if supported
        try {
            if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('AudioContext created successfully');
            }
        } catch (e) {
            console.log('Web Audio API not supported in this browser');
        }
        
        console.log('Sound initialization complete');
    } catch (error) {
        console.error('Error initializing sounds:', error);
    }
    
    // Initialize sound settings
    initSoundSettings();
}

// Function to play sounds using Web Audio API instead of Audio elements
function playSound(soundType) {
    // Check if sound is disabled by user preference
    if (localStorage.getItem('soundEnabled') === 'false') {
        return;
    }
    
    try {
        // Use different sounds for different game events
        if (soundType === eatSound) {
            createBeepSound(880, 0.1, 'sine', 0.3); // High-pitched short beep
        } else if (soundType === gameOverSound) {
            // Create a sad game over sound (descending tones)
            if (audioContext) {
                const now = audioContext.currentTime;
                const duration = 1.5;
                
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(110, now + duration);
                
                gainNode.gain.setValueAtTime(0.3, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                oscillator.stop(now + duration);
            }
        } else if (soundType === moveSound) {
            createBeepSound(220, 0.05, 'sine', 0.1); // Very soft, low beep
        } else if (soundType === powerupSound) {
            // Create ascending powerup sound
            if (audioContext) {
                const now = audioContext.currentTime;
                const duration = 0.5;
                
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(880, now + duration);
                
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0.4, now + duration/2);
                gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                oscillator.stop(now + duration);
            }
        } else if (soundType === specialFoodSound) {
            // Create a special food sound (sparkle effect)
            if (audioContext) {
                const now = audioContext.currentTime;
                const duration = 0.6;
                
                // Create multiple oscillators for richer sound
                const freqs = [880, 1320, 1760];
                for (let i = 0; i < freqs.length; i++) {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = freqs[i];
                    
                    gainNode.gain.setValueAtTime(0.01, now);
                    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1 + (i * 0.05));
                    gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.start(now + (i * 0.1));
                    oscillator.stop(now + duration);
                }
            }
        } else {
            // Default sound
            createBeepSound(440, 0.15, 'sine', 0.2);
        }
    } catch (e) {
        // Silently catch errors to prevent game crashes
        console.log('Sound play error:', e);
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

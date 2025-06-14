// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let specialFood = {};
let hasSpecialFood = false;
let specialFoodTimer = null;
let gridSize = 20;
let direction = 'right';
let gameSpeed = 100;
let gameInterval;
let frameCount = 0; // Counter for game frames
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let scoreAnimations = []; // Array to store floating score animations
// We'll check localStorage directly when needed instead of using a global variable
// This ensures we always use the current value as set by the popup-messages.js module

// DOM elements - will initialize these in the init function
let startScreen;
let gameScreen;
let gameOverScreen;
let startButton;
let pauseButton;
let restartButton;
let scoreDisplay;
let finalScoreDisplay;
let highScoreDisplay;
let soundToggle;
let popupToggle;

// Debug function - disabled in production
function debug(message) {
    // Console logging can be enabled during development
    // console.log(message);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', init);

function init() {
    debug('Initializing game...');
    try {
        // Initialize DOM elements
        startScreen = document.getElementById('start-screen');
        gameScreen = document.getElementById('game-screen');
        gameOverScreen = document.getElementById('game-over-screen');
        startButton = document.getElementById('start-button');
        pauseButton = document.getElementById('pause-button');
        restartButton = document.getElementById('restart-button');        scoreDisplay = document.getElementById('score');
        finalScoreDisplay = document.getElementById('final-score');
        highScoreDisplay = document.getElementById('high-score');
        soundToggle = document.getElementById('sound-toggle');
        popupToggle = document.getElementById('popup-toggle');
          // Note: popup message settings are now initialized in popup-messages.js
        
        // Initialize the canvas
        canvas = document.getElementById('game-canvas');
        if (!canvas) {
            debug('ERROR: Could not find canvas element');
            return;
        }
        
        ctx = canvas.getContext('2d');
        if (!ctx) {
            debug('ERROR: Could not get canvas context');
            return;
        }
        
        // Set canvas size based on window size while maintaining aspect ratio
        resizeCanvas();
        debug('Canvas initialized');
        
        // Add event listeners
        if (!startButton) {
            debug('ERROR: Start button not found');
        } else {
            startButton.addEventListener('click', startGame);
            debug('Start button listener added');
        }
        
        if (!pauseButton) {
            debug('ERROR: Pause button not found');
        } else {
            pauseButton.addEventListener('click', togglePause);
        }
        
        if (!restartButton) {
            debug('ERROR: Restart button not found');
        } else {
            restartButton.addEventListener('click', startGame);
        }
        
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('resize', resizeCanvas);
        
        // Touch controls for mobile
        setupTouchControls();
        
        // Set high score display
        if (highScoreDisplay) {
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
        
        // Initialize sounds
        initSounds();
        setupSoundControls();
        
        debug('Initialization complete');
    } catch (error) {
        debug(`ERROR during initialization: ${error.message}`);
    }
}

function resizeCanvas() {
    try {
        // Get the game container width to properly size the canvas
        const gameContainer = document.querySelector('.game-container');
        const containerWidth = gameContainer ? gameContainer.clientWidth - 40 : window.innerWidth - 40;
        
        // Calculate canvas size based on container width and maintain aspect ratio
        let maxWidth = Math.min(560, containerWidth); // Subtract padding
        debug(`Resizing canvas to ${maxWidth}px`);
        
        canvas.width = maxWidth;
        canvas.height = maxWidth;
        
        // If the game is running, redraw everything
        if (gameState === 'playing') {
            drawGame();
        }
    } catch (error) {
        debug(`ERROR during canvas resize: ${error.message}`);
    }
}

function setupTouchControls() {
    // Track touch start position
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault();
    }, false);

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent scrolling when swiping on the canvas
    }, false);

    canvas.addEventListener('touchend', function(e) {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        
        let deltaX = touchEndX - touchStartX;
        let deltaY = touchEndY - touchStartY;
        
        // Determine swipe direction based on the stronger movement
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0 && direction !== 'left') {
                direction = 'right';
            } else if (deltaX < 0 && direction !== 'right') {
                direction = 'left';
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && direction !== 'up') {
                direction = 'down';
            } else if (deltaY < 0 && direction !== 'down') {
                direction = 'up';
            }
        }
        
        e.preventDefault();
    }, false);
}

function startGame() {
    debug('Starting game...');
    try {        // Reset game variables
        snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        direction = 'right';
        score = 0;
        isPaused = false;
        frameCount = 0; // Reset frame counter
        
        // Update displays
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            debug('ERROR: Score display not found');
        }
        
        if (highScoreDisplay) {
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
        
        // Show game screen, hide others
        if (startScreen) {
            startScreen.classList.add('hidden');
        } else {
            debug('ERROR: Start screen not found');
        }
        
        if (gameOverScreen) {
            gameOverScreen.classList.add('hidden');
        }
        
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
        } else {
            debug('ERROR: Game screen not found');
        }
        
        // Generate initial food
        generateFood();
        debug('Food generated');
        
        // Set game state
        gameState = 'playing';
        debug('Game state set to playing');
        
        // Start the game loop
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
        debug('Game loop started');
    } catch (error) {
        debug(`ERROR during game start: ${error.message}`);
    }
}

function gameLoop() {
    if (isPaused) return;
    
    try {
        debug('Game loop running');
        // Move snake
        moveSnake();
        
        // Check collisions (with walls, self, and food)
        if (checkCollision()) {
            debug('Collision detected');
            gameOver();
            return;
        }
        
    // Check if snake eats food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Increase score
        score += 10;
        updateScoreDisplay(score, '+10');
          // Play eat sound
        safePlaySound(eatSound);
        
        // Don't remove the last segment (snake grows)
        // Generate new food
        generateFood();
    }
    // Check if snake eats special food
    else if (hasSpecialFood && snake[0].x === specialFood.x && snake[0].y === specialFood.y) {
        // Apply special food effect based on type
        switch(specialFood.type) {
            case 0: // Speed boost
                clearInterval(gameInterval);
                let originalSpeed = gameSpeed;
                gameSpeed = gameSpeed * 0.7; // 30% faster
                gameInterval = setInterval(gameLoop, gameSpeed);
                
                // Reset speed after 5 seconds
                setTimeout(() => {
                    clearInterval(gameInterval);
                    gameSpeed = originalSpeed;
                    gameInterval = setInterval(gameLoop, gameSpeed);
                }, 5000);
                
                displayPowerupMessage("Speed Boost! 🚀");
                break;
                
            case 1: // Double points                score += 20; // Double the normal points
                updateScoreDisplay(score, '+20');
                displayPowerupMessage("Double Points! 🍏");
                break;
                  case 2: // Grow by 3 instead of 1
                // Add 2 extra segments
                const tail = snake[snake.length - 1];
                snake.push({...tail}, {...tail});
                displayPowerupMessage("Super Growth! +3 🐍");
                break;
        }        // Play special sound for power-up
        safePlaySound(specialFoodSound);
        
        // Remove special food
        hasSpecialFood = false;
        if (specialFoodTimer) clearTimeout(specialFoodTimer);
    } else {
        // Remove the last segment (snake moves without growing)
        snake.pop();
    }    function displayPowerupMessage(message) {
        // Check if popup messages are disabled (read current state from localStorage)
        if (localStorage.getItem('popupMessagesEnabled') === 'false') {
            return;
        }

        const powerupMsg = document.createElement('div');
        powerupMsg.className = 'powerup-message';
        
        // Replace the "2️⃣" icon with a green apple icon for Double Points
        if (message.includes('Double')) {
            message = message.replace("2️⃣", "🍏");
        }
        
        powerupMsg.textContent = message;
        
        // Enhanced styles for semi-transparency and better blur effect
        powerupMsg.style.backdropFilter = 'blur(5px)'; 
        
        // Make powerup message 20% larger than the current size (which was 50% of original)
        // This results in ~60% of original size (50% * 1.2 = 60%)
        powerupMsg.style.fontSize = '13.2px'; // 20% larger than 11px
        powerupMsg.style.padding = '7.2px 14.4px'; // 20% larger padding
        
        // Set different colors based on the power-up type - matching the special food colors
        if (message.includes('Speed')) {
            // Match yellow/orange of speed boost food with 20% less transparency
            powerupMsg.style.backgroundColor = 'rgba(255, 235, 59, 0.38)'; // 20% less transparent than 0.32
            powerupMsg.style.borderColor = 'rgba(255, 152, 0, 0.48)'; // 20% less transparent
            powerupMsg.style.color = 'black';
            powerupMsg.style.fontWeight = 'bold';
            powerupMsg.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.9)';
            powerupMsg.style.boxShadow = '0 0 15px rgba(255, 235, 59, 0.36), 0 0 30px rgba(255, 152, 0, 0.24)'; // 20% less transparent
        } else if (message.includes('Double')) {
            // Match green of double points food with 20% less transparency
            powerupMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.38)'; // 20% less transparent than 0.32
            powerupMsg.style.borderColor = 'rgba(139, 195, 74, 0.48)'; // 20% less transparent
            powerupMsg.style.color = 'white';
            powerupMsg.style.fontWeight = 'bold';
            powerupMsg.style.textShadow = '0 0 6px rgba(0, 0, 0, 0.9)';
            powerupMsg.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.36), 0 0 30px rgba(139, 195, 74, 0.24)'; // 20% less transparent
        } else if (message.includes('Growth')) {
            // Match purple of growth food with 20% less transparency
            powerupMsg.style.backgroundColor = 'rgba(170, 0, 255, 0.38)'; // 20% less transparent than 0.32
            powerupMsg.style.borderColor = 'rgba(234, 128, 252, 0.48)'; // 20% less transparent
            powerupMsg.style.borderWidth = '2px'; // Maintain border width
            powerupMsg.style.fontWeight = 'bold';
            powerupMsg.style.textShadow = '0 0 8px white, 0 0 15px white';
            powerupMsg.style.boxShadow = '0 0 15px rgba(170, 0, 255, 0.36), 0 0 30px rgba(234, 128, 252, 0.3)'; // 20% less transparent
            powerupMsg.style.color = 'white';
        }
        
        // 20% less transparent than current 0.45 opacity
        powerupMsg.style.opacity = '0.54';
        
        // Find the canvas container to position the message relative to the game area
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.position = 'relative';
            canvasContainer.appendChild(powerupMsg);
        } else {
            gameScreen.appendChild(powerupMsg);
        }
        
        // Add a slight entrance animation
        powerupMsg.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            powerupMsg.style.transition = 'transform 0.3s ease-out, opacity 0.5s ease-out';
            powerupMsg.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Show message for half the original time (1000ms instead of 2000ms)
        setTimeout(() => {
            powerupMsg.classList.add('fade-out');
            setTimeout(() => {
                powerupMsg.remove();
            }, 400); // Keep the fade-out time the same
        }, 1000); // Keep the display time the same
    }// Update score animations
    updateScoreAnimations();
      
    // Draw the game
    drawGame();
    } catch (error) {
        debug(`ERROR in game loop: ${error.message}`);
        console.error(error);
    }
}

function moveSnake() {
    // Create a new head segment based on the current direction
    let newHead = { x: snake[0].x, y: snake[0].y };
    
    // Update head position based on current direction
    switch (direction) {
        case 'up':
            newHead.y -= 1;
            break;
        case 'down':
            newHead.y += 1;
            break;
        case 'left':
            newHead.x -= 1;
            break;
        case 'right':
            newHead.x += 1;
            break;
    }    // Increment frame counter
    frameCount++;
    
    // Play move sound at regular intervals (every 5 frames) for consistent feedback
    if (frameCount % 5 === 0) {
        safePlaySound(moveSound);
    }
    
    // Add the new head to the beginning of the snake array
    snake.unshift(newHead);
}

function checkCollision() {
    // Get the head position
    const head = snake[0];
    
    // Calculate grid dimensions based on canvas size
    const gridWidth = Math.floor(canvas.width / gridSize);
    const gridHeight = Math.floor(canvas.height / gridSize);
    
    // Check collision with walls
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    
    // Check collision with self (starting from index 1 as 0 is the head itself)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    // No collision detected
    return false;
}

function generateFood() {
    // Calculate grid dimensions based on canvas size
    const gridWidth = Math.floor(canvas.width / gridSize);
    const gridHeight = Math.floor(canvas.height / gridSize);
    
    // Generate random coordinates
    let foodX, foodY;
    let validPosition = false;
    
    // Keep generating until we find a position not occupied by the snake
    while (!validPosition) {
        foodX = Math.floor(Math.random() * gridWidth);
        foodY = Math.floor(Math.random() * gridHeight);
        
        // Check if the position overlaps with any snake segment
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === foodX && segment.y === foodY) {
                validPosition = false;
                break;
            }
        }
        
        // Also check if it overlaps with special food
        if (hasSpecialFood && foodX === specialFood.x && foodY === specialFood.y) {
            validPosition = false;
        }
    }
    
    // Set the food position
    food = { x: foodX, y: foodY };
    
    // 20% chance to generate special food if none exists
    if (!hasSpecialFood && Math.random() < 0.2) {
        generateSpecialFood();
    }
}

function generateSpecialFood() {
    // Calculate grid dimensions based on canvas size
    const gridWidth = Math.floor(canvas.width / gridSize);
    const gridHeight = Math.floor(canvas.height / gridSize);
    
    // Generate random coordinates
    let foodX, foodY;
    let validPosition = false;
    
    // Keep generating until we find a position not occupied by the snake or regular food
    while (!validPosition) {
        foodX = Math.floor(Math.random() * gridWidth);
        foodY = Math.floor(Math.random() * gridHeight);
        
        // Check if the position overlaps with any snake segment or regular food
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === foodX && segment.y === foodY) {
                validPosition = false;
                break;
            }
        }
        
        if (foodX === food.x && foodY === food.y) {
            validPosition = false;
        }
    }
    
    // Set the special food position and type
    specialFood = { 
        x: foodX, 
        y: foodY, 
        type: Math.floor(Math.random() * 3) // 0: speed boost, 1: double points, 2: invincible
    };
    hasSpecialFood = true;
    
    // Special food disappears after 10 seconds
    if (specialFoodTimer) clearTimeout(specialFoodTimer);
    specialFoodTimer = setTimeout(() => {
        hasSpecialFood = false;
    }, 10000);
}

function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate actual grid size based on canvas dimensions
    const cellSize = canvas.width / Math.floor(canvas.width / gridSize);
    
    // Draw the snake
    snake.forEach((segment, index) => {
        // Create gradient coloring for snake body
        if (index === 0) {
            // Head is darker green
            ctx.fillStyle = '#2e7d32';
        } else {
            // Body segments with gradient color
            const greenIntensity = Math.max(50, 100 - (index * 3) % 40);
            ctx.fillStyle = `rgb(${50 + greenIntensity}, ${180 - index % 30}, ${50 + greenIntensity % 40})`;
        }
        
        // Draw rounded corners for the snake segments
        const radius = cellSize / 5;
        const x = segment.x * cellSize;
        const y = segment.y * cellSize;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + cellSize, y, x + cellSize, y + cellSize, radius);
        ctx.arcTo(x + cellSize, y + cellSize, x, y + cellSize, radius);
        ctx.arcTo(x, y + cellSize, x, y, radius);
        ctx.arcTo(x, y, x + cellSize, y, radius);
        ctx.closePath();
        ctx.fill();
        
        // Draw eyes and tongue on the head
        if (index === 0) {
            // Draw eyes
            ctx.fillStyle = 'white';
            
            // Position eyes based on direction
            let eyeX1, eyeY1, eyeX2, eyeY2;
            switch (direction) {
                case 'up':
                    eyeX1 = x + cellSize * 0.25;
                    eyeY1 = y + cellSize * 0.25;
                    eyeX2 = x + cellSize * 0.75;
                    eyeY2 = y + cellSize * 0.25;
                    break;
                case 'down':
                    eyeX1 = x + cellSize * 0.25;
                    eyeY1 = y + cellSize * 0.75;
                    eyeX2 = x + cellSize * 0.75;
                    eyeY2 = y + cellSize * 0.75;
                    break;
                case 'left':
                    eyeX1 = x + cellSize * 0.25;
                    eyeY1 = y + cellSize * 0.25;
                    eyeX2 = x + cellSize * 0.25;
                    eyeY2 = y + cellSize * 0.75;
                    break;
                case 'right':
                    eyeX1 = x + cellSize * 0.75;
                    eyeY1 = y + cellSize * 0.25;
                    eyeX2 = x + cellSize * 0.75;
                    eyeY2 = y + cellSize * 0.75;
                    break;
            }
            
            const eyeRadius = cellSize / 10;
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(eyeX2, eyeY2, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add pupils to make eyes follow direction
            ctx.fillStyle = 'black';
            const pupilRadius = eyeRadius / 2;
            let pupilOffsetX = 0;
            let pupilOffsetY = 0;
            
            switch(direction) {
                case 'up': pupilOffsetY = -pupilRadius/2; break;
                case 'down': pupilOffsetY = pupilRadius/2; break;
                case 'left': pupilOffsetX = -pupilRadius/2; break;
                case 'right': pupilOffsetX = pupilRadius/2; break;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1 + pupilOffsetX, eyeY1 + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(eyeX2 + pupilOffsetX, eyeY2 + pupilOffsetY, pupilRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add occasional tongue animation (every ~1 second)
            if (frameCount % 60 < 10) {
                ctx.fillStyle = '#ff5252';
                if (direction === 'right') {
                    ctx.beginPath();
                    ctx.moveTo((segment.x + 1) * cellSize, segment.y * cellSize + cellSize/2);
                    ctx.lineTo((segment.x + 1) * cellSize + cellSize/3, segment.y * cellSize + cellSize/3);
                    ctx.lineTo((segment.x + 1) * cellSize + cellSize/3, segment.y * cellSize + cellSize*2/3);
                    ctx.fill();
                } else if (direction === 'left') {
                    ctx.beginPath();
                    ctx.moveTo(segment.x * cellSize, segment.y * cellSize + cellSize/2);
                    ctx.lineTo(segment.x * cellSize - cellSize/3, segment.y * cellSize + cellSize/3);
                    ctx.lineTo(segment.x * cellSize - cellSize/3, segment.y * cellSize + cellSize*2/3);
                    ctx.fill();
                } else if (direction === 'up') {
                    ctx.beginPath();
                    ctx.moveTo(segment.x * cellSize + cellSize/2, segment.y * cellSize);
                    ctx.lineTo(segment.x * cellSize + cellSize/3, segment.y * cellSize - cellSize/3);
                    ctx.lineTo(segment.x * cellSize + cellSize*2/3, segment.y * cellSize - cellSize/3);
                    ctx.fill();
                } else if (direction === 'down') {
                    ctx.beginPath();
                    ctx.moveTo(segment.x * cellSize + cellSize/2, (segment.y + 1) * cellSize);
                    ctx.lineTo(segment.x * cellSize + cellSize/3, (segment.y + 1) * cellSize + cellSize/3);
                    ctx.lineTo(segment.x * cellSize + cellSize*2/3, (segment.y + 1) * cellSize + cellSize/3);
                    ctx.fill();
                }
            }
        }
    });
    // Draw the food
    ctx.fillStyle = '#ff5252'; // Red food
    const foodX = food.x * cellSize;
    const foodY = food.y * cellSize;
    
    // Calculate a scaling factor based on frameCount for a pulsing effect
    const pulseFactor = 1 + 0.1 * Math.sin(frameCount * 0.1);
    
    // Draw apple-shaped food with pulsing effect
    ctx.beginPath();
    ctx.arc(
        foodX + cellSize/2, 
        foodY + cellSize/2, 
        cellSize/2 * 0.8 * pulseFactor, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    
    // Add a leaf with slight wiggle
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    const leafAngle = Math.PI/4 + Math.sin(frameCount * 0.05) * 0.1;
    ctx.ellipse(
        foodX + cellSize/2 + cellSize/8, 
        foodY + cellSize/3, 
        cellSize/4,
        cellSize/8,
        leafAngle,
        0,
        Math.PI * 2
    );
    ctx.fill();
    // Draw special food if it exists
    if (hasSpecialFood) {        // Define more vibrant colors for each power-up type
        let specialFoodColor, specialFoodIconChar, specialFoodBorderColor;
        switch(specialFood.type) {
            case 0: 
                specialFoodColor = '#ffeb3b';         // Bright yellow core for speed boost
                specialFoodBorderColor = '#ff9800';   // Orange glow/border
                specialFoodIconChar = '⚡';           // Lightning bolt icon
                break;
            case 1: 
                specialFoodColor = '#4caf50';         // Green core for double points
                specialFoodBorderColor = '#8bc34a';   // Light green glow/border
                specialFoodIconChar = '×2';           // ×2 icon
                break;            case 2: 
                specialFoodColor = '#aa00ff';         // Vivid purple core for super growth
                specialFoodBorderColor = '#ea80fc';   // Bright pink/purple border for contrast
                specialFoodIconChar = '+3';           // Clear +3 icon (more intuitive for growth)
                break;
        }
        
        const specialFoodX = specialFood.x * cellSize;
        const specialFoodY = specialFood.y * cellSize;
        
        // Calculate time remaining for special food
        const specialFoodRemaining = 10 - ((Date.now() - (specialFoodTimer._idleStart + specialFoodTimer._idleTimeout - Date.now())) / 1000);
        const pulseSpeed = Math.max(0.05, specialFoodRemaining / 150); // Pulse faster as time runs out
        const pulseFactor = 1 + 0.15 * Math.sin(frameCount * pulseSpeed);
        
        // Create a more contained, visible glow effect
        const glowSize = cellSize * 1.5; // More contained than before
        const gradient = ctx.createRadialGradient(
            specialFoodX + cellSize/2, 
            specialFoodY + cellSize/2, 
            cellSize/4,                  // Smaller inner radius
            specialFoodX + cellSize/2, 
            specialFoodY + cellSize/2, 
            glowSize/2                   // Smaller outer radius
        );
        
        // More defined gradient with stronger core
        gradient.addColorStop(0, specialFoodColor);
        gradient.addColorStop(0.6, specialFoodBorderColor);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        // Draw the glow effect
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            specialFoodX + cellSize/2,
            specialFoodY + cellSize/2,
            glowSize/2,
            0,
            Math.PI * 2
        );
        ctx.fill();
          // Rotate for the star
        ctx.save();
        ctx.translate(specialFoodX + cellSize/2, specialFoodY + cellSize/2);
        
        // Different rotation speeds based on power-up type
        let rotationSpeed = 0.02;
        if (specialFood.type === 2) { // Growth power-up gets faster rotation
            rotationSpeed = 0.03;
        }
        ctx.rotate(frameCount * rotationSpeed);
        
        // Draw a more defined star shape with solid color and border
        ctx.fillStyle = specialFoodColor;          // Draw different star shapes based on power-up type
        if (specialFood.type === 2) { // Growth power-up
            // Create a strong outer glow first
            ctx.shadowColor = specialFoodColor;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Draw a larger, more prominent star for growth power-up
            drawStar(0, 0, 6, cellSize/2 * 0.95 * pulseFactor, cellSize/3 * pulseFactor);
            
            // Add a pulse ring effect
            ctx.strokeStyle = specialFoodBorderColor;
            ctx.lineWidth = cellSize * 0.08 * (1 + 0.3 * Math.sin(frameCount * 0.1));
            ctx.beginPath();
            ctx.arc(0, 0, cellSize/2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (specialFood.type === 0) { // Speed boost
            drawStar(0, 0, 5, cellSize/2 * 0.85 * pulseFactor, cellSize/3 * pulseFactor);
        } else { // Double points
            drawStar(0, 0, 4, cellSize/2 * 0.85 * pulseFactor, cellSize/3 * pulseFactor);
        }
        
        // Add a border to the star for better visibility
        ctx.strokeStyle = 'white';
        ctx.lineWidth = cellSize * 0.05;
        ctx.stroke();
        
        ctx.restore();          // Add power-up icon in the middle of the star
        // First add a text background for better readability
        if (specialFood.type === 2) { // Growth power-up gets special treatment
            // Add a circular background for the icon text
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.arc(
                specialFoodX + cellSize/2,
                specialFoodY + cellSize/2,
                cellSize/3.5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Draw text with a slight outline for better visibility
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Use a larger font for the growth power-up to improve visibility
        if (specialFood.type === 2) {
            // Draw text with shadow and larger size for growth
            ctx.font = `bold ${cellSize/1.6}px Arial`;
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Draw the text with extra emphasis
            ctx.fillText(
                specialFoodIconChar,
                specialFoodX + cellSize/2,
                specialFoodY + cellSize/2
            );
            
            // Add a subtle glow around text
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';
            ctx.strokeText(
                specialFoodIconChar,
                specialFoodX + cellSize/2,
                specialFoodY + cellSize/2
            );
        } else {
            // Standard text for other power-ups
            ctx.font = `bold ${cellSize/1.8}px Arial`;
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 3;
            ctx.fillText(
                specialFoodIconChar,
                specialFoodX + cellSize/2,
                specialFoodY + cellSize/2
            );
        }
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Show countdown timer for the last 5 seconds with decreasing size
        if (specialFoodRemaining < 5) {
            // Add a small shadow around the timer for better visibility
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            
            ctx.fillStyle = 'white';
            const timerSize = Math.min(1.0, specialFoodRemaining / 3) * cellSize/2;
            ctx.font = `bold ${timerSize}px Arial`;
            
            // Position at the bottom right of the star for less interference
            ctx.fillText(
                Math.ceil(specialFoodRemaining).toString(),
                specialFoodX + cellSize * 0.8,
                specialFoodY + cellSize * 0.8
            );
            
            ctx.shadowBlur = 0; // Reset shadow
        }
    }    // Function to draw a star
    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for(let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        
        // Create a solid fill first
        ctx.fill();
        
        // Add a visible stroke to make the star more visible
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }
    
    // Draw a grid (optional - for debugging)
    // drawGrid(cellSize);
}

function drawGrid(cellSize) {
    // Draw grid for debugging purposes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    const gridWidth = Math.floor(canvas.width / cellSize);
    const gridHeight = Math.floor(canvas.height / cellSize);
    
    for (let i = 0; i <= gridWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
    }
    
    for (let j = 0; j <= gridHeight; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * cellSize);
        ctx.lineTo(canvas.width, j * cellSize);
        ctx.stroke();
    }
}

function handleKeyPress(event) {
    // Prevent arrow keys from scrolling the page
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(event.key) > -1) {
        event.preventDefault();
    }
    
    if (gameState === 'playing') {
        switch(event.key) {
            case 'ArrowUp':
                if (direction !== 'down') {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (direction !== 'right') {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (direction !== 'left') {
                    direction = 'right';
                }
                break;
            case ' ':
                // Space bar to pause/resume
                togglePause();
                break;
        }
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    
    // Add visual feedback by toggling class
    if (isPaused) {
        pauseButton.classList.add('resumed');
        pauseButton.title = "Resume Game";
    } else {
        pauseButton.classList.remove('resumed');
        pauseButton.title = "Pause Game";
    }
    
    // Add button press animation
    pauseButton.classList.add('pressed');
    setTimeout(() => {
        pauseButton.classList.remove('pressed');
    }, 200);
}

function gameOver() {
    // Stop the game loop
    clearInterval(gameInterval);
    
    // Update game state
    gameState = 'gameOver';
      // Play game over sound
    safePlaySound(gameOverSound);
    
    // Check for high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
    
    // Update displays
    finalScoreDisplay.textContent = score;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    
    // Show game over screen
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Helper function to safely play sounds (replaced with direct playSound call since Web Audio API is more reliable)
function safePlaySound(sound) {
    playSound(sound);
}

// Helper function to animate score change
function updateScoreDisplay(newScore, scoreChange) {
    // Update score display
    scoreDisplay.textContent = `Score: ${newScore}`;
    
    // Add flash animation class
    scoreDisplay.classList.add('score-flash');
    
    // Remove animation class after it completes
    setTimeout(() => {
        scoreDisplay.classList.remove('score-flash');
    }, 300);
    
    // Add floating score animation
    if (scoreChange) {
        const head = snake[0];
        scoreAnimations.push({
            x: head.x,
            y: head.y,
            value: scoreChange,
            opacity: 1,
            offsetY: 0
        });
    }
}

// Function to update and draw score animations
function updateScoreAnimations() {
    const cellSize = canvas.width / Math.floor(canvas.width / gridSize);
    
    // Update each animation
    for (let i = 0; i < scoreAnimations.length; i++) {
        const anim = scoreAnimations[i];
        
        // Draw the score value
        ctx.save();
        ctx.font = `bold ${cellSize * 0.5}px Arial`;
        ctx.fillStyle = `rgba(255, 82, 82, ${anim.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            anim.value,
            anim.x * cellSize + cellSize / 2,
            (anim.y * cellSize) - anim.offsetY
        );
        ctx.restore();
        
        // Update animation
        anim.opacity -= 0.02;
        anim.offsetY += 1;
        
        // Remove finished animations
        if (anim.opacity <= 0) {
            scoreAnimations.splice(i, 1);
            i--;
        }
    }
}

// Note: popup message functions and event listeners are now in popup-messages.js
// This ensures consistency and avoids duplicate event listeners

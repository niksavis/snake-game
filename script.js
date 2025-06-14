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
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

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
        restartButton = document.getElementById('restart-button');
        scoreDisplay = document.getElementById('score');
        finalScoreDisplay = document.getElementById('final-score');
        highScoreDisplay = document.getElementById('high-score');
        soundToggle = document.getElementById('sound-toggle');
        
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
    try {
        // Reset game variables
        snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        direction = 'right';
        score = 0;
        isPaused = false;
        
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
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Play eat sound
        playSound(eatSound);
        
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
                
            case 1: // Double points
                score += 20; // Double the normal points
                scoreDisplay.textContent = `Score: ${score}`;
                displayPowerupMessage("Double Points! 2️⃣");
                break;
                
            case 2: // Grow by 3 instead of 1
                // Add 2 extra segments
                const tail = snake[snake.length - 1];
                snake.push({...tail}, {...tail});
                displayPowerupMessage("Super Growth! 🐍");
                break;
        }
        
        // Play special sound for power-up
        playSound(eatSound);
        
        // Remove special food
        hasSpecialFood = false;
        if (specialFoodTimer) clearTimeout(specialFoodTimer);
    } else {
        // Remove the last segment (snake moves without growing)
        snake.pop();
    }
    
    function displayPowerupMessage(message) {
        const powerupMsg = document.createElement('div');
        powerupMsg.className = 'powerup-message';
        powerupMsg.textContent = message;
        gameScreen.appendChild(powerupMsg);
        
        setTimeout(() => {
            powerupMsg.classList.add('fade-out');
            setTimeout(() => {
                powerupMsg.remove();
            }, 500);
        }, 1500);
    }
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
    }
    
    // Play move sound occasionally (not on every frame to avoid sound overlap)
    if (Math.random() < 0.1) {
        playSound(moveSound);
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
        ctx.fillStyle = index === 0 ? '#2e7d32' : '#4caf50'; // Head is darker green
        
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
        
        // Draw eyes on the head
        if (index === 0) {
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
        }
    });
      // Draw the food
    ctx.fillStyle = '#ff5252'; // Red food
    const foodX = food.x * cellSize;
    const foodY = food.y * cellSize;
    
    // Draw apple-shaped food
    ctx.beginPath();
    ctx.arc(foodX + cellSize/2, foodY + cellSize/2, cellSize/2 * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a leaf
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    ctx.ellipse(
        foodX + cellSize/2 + cellSize/8, 
        foodY + cellSize/3, 
        cellSize/4, 
        cellSize/8, 
        Math.PI/4, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw special food if it exists
    if (hasSpecialFood) {
        let specialFoodColor;
        switch(specialFood.type) {
            case 0: specialFoodColor = '#ffeb3b'; break; // Yellow for speed boost
            case 1: specialFoodColor = '#4caf50'; break; // Green for double points
            case 2: specialFoodColor = '#9c27b0'; break; // Purple for invincibility
        }
        
        const specialFoodX = specialFood.x * cellSize;
        const specialFoodY = specialFood.y * cellSize;
        
        // Draw star-shaped special food
        ctx.fillStyle = specialFoodColor;
        drawStar(
            specialFoodX + cellSize/2, 
            specialFoodY + cellSize/2, 
            5, 
            cellSize/2 * 0.8, 
            cellSize/4
        );
        
        // Make it pulsate
        if (Math.floor(Date.now() / 200) % 2 === 0) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    // Function to draw a star
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
        ctx.fill();
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
}

function gameOver() {
    // Stop the game loop
    clearInterval(gameInterval);
    
    // Update game state
    gameState = 'gameOver';
    
    // Play game over sound
    playSound(gameOverSound);
    
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

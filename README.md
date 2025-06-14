# Snake Game

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A modern implementation of the classic Snake game built with vanilla JavaScript, HTML5 Canvas, and CSS. This project demonstrates how to create an engaging web-based game with responsive design, custom animations, and advanced features without any external libraries or frameworks.

## Features

- **Classic Snake Gameplay**: Navigate the snake to collect food and grow longer
- **Responsive Design**: Adapts to all screen sizes from desktop to mobile
- **Touch Controls**: Swipe gestures for mobile devices
- **Keyboard Controls**: Arrow keys for direction, space bar for pause/resume
- **High Score System**: Persistent score tracking using localStorage
- **Game States**: Start screen, gameplay, and game over screens with transitions
- **Special Power-ups**: Three unique special food items with different effects:
  - Speed Boost (Yellow Star ⚡): Temporarily increases snake speed
  - Double Points (Green Star ×2): Awards extra points
  - Super Growth (Purple Star +3): Adds multiple segments at once
- **Custom Sound System**: Procedurally generated audio using Web Audio API
- **Toggle Controls**:
  - Sound toggle (🔊/🔇)
  - In-game message toggle (💬)
- **Visual Effects**:
  - Animated snake with gradient coloring and directional eyes
  - Pulsing food with leaf detail
  - Glowing special food with rotation effects
  - Floating score animations
  - Power-up message notifications
  - Game over screen with animated score display

## How to Play

1. Press the "Start Game" button to begin
2. Control the snake using arrow keys (desktop) or swipe gestures (mobile)
3. Eat the red apple food to grow and earn points
4. Collect special star-shaped food for powerful bonuses
5. Avoid colliding with the walls or the snake's own body
6. Try to achieve the highest score possible

## Controls

- **Movement**:
  - **Desktop**: Arrow keys (↑, →, ↓, ←)
  - **Mobile**: Swipe in the desired direction
- **Pause/Resume**:
  - **Desktop**: Space bar or click the pause button (⏸/▶)
  - **Mobile**: Tap the pause button
- **Sound**: Toggle with the sound button (🔊/🔇)
- **Messages**: Toggle in-game notifications with the message button (💬)

## Technical Implementation

This game is built entirely with:

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling with transitions, animations, and responsive design
- **JavaScript**: Vanilla JS with no external dependencies
- **Canvas API**: For efficient game rendering
- **Web Audio API**: For procedural sound generation
- **LocalStorage API**: For persistent high score and user preferences

## Project Structure

- `index.html` - Main game HTML structure
- `style.css` - Complete styling and animations
- `script.js` - Core game logic and mechanics
- `sounds.js` - Sound generation and management
- `popup-messages.js` - Game notification system
- `README.md` - Project documentation
- `todo.md` - Implementation guide and task list

## Accessibility Features

- Keyboard navigation throughout the game
- ARIA attributes for improved screen reader compatibility
- Sufficient color contrast for all game elements
- Multiple control methods (keyboard and touch)
- Visual feedback for all interactions

## Browser Compatibility

This game works in all modern browsers that support HTML5 Canvas and Web Audio API:

- Chrome
- Firefox
- Safari
- Edge

## Installation

No installation required! Simply clone or download the repository and open `index.html` in your browser.

```bash
git clone https://github.com/yourusername/snake-game.git
cd snake-game
```

Then open `index.html` in your browser of choice.

## License

[MIT License](LICENSE)

**[⬆ Back to Top](#snake-game)**

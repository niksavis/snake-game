# Snake Game

A classic Snake game implementation using vanilla JavaScript, HTML5 Canvas, and CSS. This game is a modern recreation of the famous game that was popular on Nokia phones.

## Features

- Classic snake gameplay
- Responsive design for all screen sizes
- Mobile touch controls
- High score tracking using localStorage
- Multiple game states (start, playing, game over)
- Special food items with unique power-ups:
  - Speed boost (yellow star)
  - Double points (green star)
  - Super growth (purple star)
- Sound effects with toggle option

## How to Play

1. Press the "Start Game" button to begin
2. Control the snake using the arrow keys (keyboard) or swipe gestures (mobile)
3. Eat the red apples to grow and earn points
4. Collect special star-shaped food for power-ups
5. Avoid hitting the walls or the snake's own body
6. Try to achieve the highest score possible

## Controls

- **Desktop:** Arrow keys for movement, Space bar to pause/resume
- **Mobile:** Swipe in the desired direction to change the snake's movement
- **Sound:** Click the sound button at the bottom to toggle sound effects

## Implementation Details

This game is built with:

- Vanilla JavaScript (no libraries or frameworks)
- HTML5 Canvas for rendering
- CSS for styling
- LocalStorage for storing high scores

## Project Structure

- `index.html` - Main HTML document
- `style.css` - CSS styling
- `script.js` - Core game logic
- `sounds.js` - Sound management
- `assets/` - Sound files and other assets

## Accessibility Features

- Keyboard navigation
- Sufficient color contrast
- Focus management
- Touch controls for mobile devices

## Browser Compatibility

This game is compatible with all modern browsers that support HTML5 Canvas:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT License

# Snake Game Implementation Guide

> This is an agentic AI-friendly implementation guide compatible with the TodoMD VS Code extension. All tasks include hashtags (#) for categorization and @ tags for associations. Tasks are deliberately unticked to allow AI to implement them.

## Recommended Implementation Approach

For AI developers or humans implementing this Snake game, follow this phased approach:

1. **Project Setup Phase**: @setup #phase
   - Create all necessary files with basic structure @structure
   - Implement HTML skeleton and basic CSS @html @css
   - Set up initial JavaScript files @js

2. **Core Mechanics Phase**: @core #phase
   - Implement snake movement and rendering @gameplay
   - Add basic food generation and collision detection @algorithms
   - Create simple scoring system @gameplay

3. **Game Loop Phase**: @gameplay #phase
   - Implement the main game loop @core
   - Add game states (start, playing, game over) @state
   - Create screen transitions @ui

4. **Enhancement Phase**: @features #phase
   - Add special food and power-ups @gameplay
   - Implement sound system @audio
   - Add visual enhancements and animations @animation
   - Create responsive design adaptations @responsive

5. **Polish and Finalization Phase**: @polish #phase
   - Add user preference persistence @preferences
   - Implement accessibility features @accessibility
   - Optimize performance @performance
   - Add final visual polish @design
   - Prepare for deployment @deployment

This phased approach ensures that you have a functional game early in the development process and can incrementally add features and polish.

## Overview

Create a classic Snake game with modern features such as responsive design, touch controls, sound effects, and special power-ups. This guide outlines all necessary tasks to build a complete web-based Snake game. This document serves both as a task list for implementation and as a reference guide for future developers or AI assistants who want to create a similar game.

## Dependencies and Technical Requirements

- [ ] #feat Use only vanilla JavaScript, CSS, and HTML (no external libraries or frameworks) @tech
- [ ] #feat Utilize Web Audio API for all sound effects and audio functionality @audio
- [ ] #feat Use browser Web APIs for all required functionality (localStorage, requestAnimationFrame, etc.) @tech
- [ ] #feat Avoid dependencies on external assets (images, audio files, fonts, etc.) @asset-management
- [ ] #feat Implement all game functionality within the browser environment @tech
- [ ] #feat Ensure cross-browser compatibility with modern browsers @compatibility
- [ ] #feat Create responsive design that works on both desktop and mobile devices @ui

## Tasks

### 1. Project Structure and File Organization

- [ ] #structure Create essential files for the application: @setup
  - [ ] `index.html` - Main HTML document with game layout and structure @html
  - [ ] `style.css` - CSS styling and animations for the game interface @css
  - [ ] `script.js` - Core game logic and mechanics @js
  - [ ] `sounds.js` - Sound generation and management using Web Audio API @audio
  - [ ] `popup-messages.js` - Game notification system and message toggle functionality @ui
  - [ ] `test.html` - Canvas testing and verification page @testing
  - [ ] `sound-test.html` - Audio system testing and debugging tool @testing
  - [ ] `README.md` - Project documentation with features and instructions @docs
  - [ ] `LICENSE` - MIT license for the project @legal
  - [ ] `todo.md` - Implementation guide and task list @docs

### 2. HTML Structure

- [ ] #html Create a basic HTML document with appropriate meta tags and viewport settings @structure
- [ ] #html Add SVG data URI favicon with snake design @ui
- [ ] #html Add fallback emoji favicon for browsers that don't support SVG @compatibility
- [ ] #html Implement three game screens: @ui
  - [ ] Start screen with game title and instructions @ui
  - [ ] Game screen with canvas and controls @ui
  - [ ] Game over screen with final score and restart button @ui
- [ ] #html Add canvas element for game rendering @core
- [ ] #html Set up UI elements with proper ARIA attributes: @accessibility
  - [ ] Score display container @ui
  - [ ] Game control buttons (pause/resume, sound, messages) @ui
  - [ ] Game over screen with score containers for current and high score @ui

### 3. CSS Styling and Visual Design

- [ ] #css Create responsive layout that works on different screen sizes @responsive
- [ ] #css Implement a cohesive color scheme with green snake theme @design
- [ ] #css Style the game container with: @ui
  - [ ] Rounded corners and borders @ui
  - [ ] Subtle drop shadows for depth @ui
  - [ ] Semi-transparent background pattern @ui
- [ ] #css Design UI elements with consistent styling: @ui
  - [ ] Round toggle buttons for controls (pause, sound, messages) @ui
  - [ ] Rectangular action buttons with snake icon (start game, play again) @ui
  - [ ] Score displays with contrasting backgrounds @ui
- [ ] #css Implement transitions and animations: @animation
  - [ ] Button press animations with keyframes @animation
  - [ ] Score flash effect when updated @animation
  - [ ] Power-up message animations @animation
  - [ ] Game over screen pulse effect @animation
- [ ] #css Create distinct visual styling for game elements @design
- [ ] #css Add visual feedback for all user interactions @ux
- [ ] #css Ensure adequate contrast for accessibility @accessibility

### 4. Game Initialization and Setup

- [ ] #init Create initialization function triggered on DOMContentLoaded @core
- [ ] #init Define and initialize game variables and state: @core
  - [ ] Canvas and rendering context @rendering
  - [ ] Snake position array @gameplay
  - [ ] Food and special food objects @gameplay
  - [ ] Game control variables (speed, direction, score) @gameplay
  - [ ] Game state tracking ('start', 'playing', 'gameOver') @state
- [ ] #init Set up canvas with proper sizing @responsive
- [ ] #init Create resize handler for responsive canvas adaptation @responsive
- [ ] #init Implement error handling for initialization failures @error-handling
- [ ] #init Load high score from localStorage with fallback @persistence
- [ ] #init Set up comprehensive event listeners: @interactivity
  - [ ] Button interactions for game controls @ui
  - [ ] Keyboard input for movement and pause @controls
  - [ ] Touch controls for mobile users @mobile
- [ ] #init Initialize sound system with Web Audio API @audio
- [ ] #init Initialize user preference settings (sound, messages) @preferences

### 5. Core Game Mechanics

- [ ] #core Implement the main game loop with setInterval timing @gameplay
- [ ] #core Create snake data structure as array of position objects @data
- [ ] #core Develop snake movement system: @gameplay
  - [ ] Directional control with validation (prevent 180° turns) @controls
  - [ ] Head-first movement with body following @animation
  - [ ] Growth mechanism when food is eaten @gameplay
- [ ] #core Implement comprehensive collision detection: @gameplay
  - [ ] Wall boundaries based on canvas dimensions @collision
  - [ ] Self-collision checking with own body segments @collision
- [ ] #core Create food system: @gameplay
  - [ ] Random position generation avoiding snake positions @algorithms
  - [ ] Regular food rendering and collision detection @rendering
  - [ ] Special food with different types and effects @powerups
  - [ ] Timeout for special food disappearance @timer
- [ ] #core Develop scoring system: @gameplay
  - [ ] Base points for regular food @scoring
  - [ ] Bonus points for special food @scoring
  - [ ] High score tracking and persistence @persistence
- [ ] #core Implement game state transitions: @state
  - [ ] Start → Playing → Game Over flow @flow
  - [ ] Pause/Resume functionality @controls
  - [ ] Game over condition detection and handling @collision

### 6. Advanced Features and Game Enhancements

- [ ] #feature Implement comprehensive touch controls for mobile devices: @mobile
  - [ ] Swipe detection in four directions @controls
  - [ ] Prevent scrolling while playing with touch events @ux
  - [ ] Appropriate touch sensitivity @ux
- [ ] #feature Create robust pause/resume functionality: @controls
  - [ ] Visual indication of paused state @ui
  - [ ] Toggle button with appropriate icons @ui
  - [ ] Keyboard shortcut (spacebar) @accessibility
- [ ] #feature Develop special food items with power-ups: @gameplay
  - [ ] Speed boost: Temporary game speed increase @powerups
  - [ ] Double points: Extra score for collection @powerups
  - [ ] Super growth: Multiple segment growth @powerups
  - [ ] Random generation with timeout @algorithms
- [ ] #feature Implement message toggle functionality: @ui
  - [ ] Enable/disable in-game messages @preferences
  - [ ] Persistent user preference @persistence
  - [ ] Visual indicator for current state @ui
- [ ] #feature Create comprehensive high score system: @gameplay
  - [ ] Score tracking during gameplay @scoring
  - [ ] High score comparison and update @scoring
  - [ ] Persistent storage using localStorage @persistence
  - [ ] Display in game-over screen @ui

### 7. Visual Enhancements and Animations

- [ ] #visual Snake Appearance: @design
  - [ ] Add simple eyes that follow the direction of movement @animation
  - [ ] Implement subtle gradient coloring for snake body @design
  - [ ] Add slightly rounded corners to body segments @design
  - [ ] Add occasional subtle tongue animation (low frequency) @animation
  - [ ] Color differentiation between head and body segments @design

- [ ] #visual Food Animation: @animation
  - [ ] Create gentle pulsing effect for regular food @animation
  - [ ] Add small leaf detail with minimal animation @design
  - [ ] Ensure food is visually distinct from snake @ux

- [ ] #visual Special Food Effects: @animation
  - [ ] Implement soft glow effect around special food @effects
  - [ ] Add gentle rotation to special food items @animation
  - [ ] Use distinct colors for different power-up types: @design
    - [ ] Yellow for speed boost @color
    - [ ] Green for double points @color
    - [ ] Purple for super growth @color
  - [ ] Display countdown timer only when nearly expired @ui
  - [ ] Add spawn animation for special food appearance @animation

- [ ] #visual Score and Feedback Animations: @ux
  - [ ] Add small floating score numbers when points are earned @feedback
  - [ ] Create subtle pulse effect on score display when updated @feedback
  - [ ] Show brief power-up text when special food is consumed @feedback
  - [ ] Implement animated transitions between game states @animation
  - [ ] Add pulse animation to game over text @animation

### 8. Sound System and Audio Effects

- [ ] #audio Create comprehensive sound system architecture: @audio
  - [ ] Initialize Web Audio API context @setup
  - [ ] Implement procedural sound generation functions @algorithm
  - [ ] Set up sound object references (no external audio files) @asset-management
  - [ ] Add error handling and fallbacks @error-handling
- [ ] #audio Implement distinct sounds for various game events: @audio
  - [ ] Regular movement sound (subtle, low-frequency) @sounds
  - [ ] Food consumption sound (pleasant, higher pitch) @sounds
  - [ ] Game over sound (descending tone) @sounds
  - [ ] Power-up collection sound (special effect) @sounds
  - [ ] Button click feedback sounds @feedback
- [ ] #audio Develop sound toggle functionality: @ui
  - [ ] Visual indicator with icon change (🔊/🔇) @ui
  - [ ] Button animation feedback @animation
  - [ ] Real-time effect on sound playback @audio
- [ ] #audio Create robust fallback mechanisms: @compatibility
  - [ ] Graceful degradation for browsers without Web Audio API @fallback
  - [ ] Silent operation mode when audio unavailable @fallback
  - [ ] Error handling for audio operations @error-handling
- [ ] #audio Implement sound preference persistence: @preferences
  - [ ] Store user preference in localStorage @persistence
  - [ ] Retrieve and apply setting on game initialization @initialization
  - [ ] Ensure consistent experience across sessions @ux

### 9. Game Polish and User Experience

- [ ] #polish Add debug functionality for development: @debugging
  - [ ] Console logging system with enable/disable capability @logging
  - [ ] Visual debug element (hidden in production) @ui
  - [ ] Error handling with informative messages @error-handling
- [ ] #polish Implement smooth animations throughout the game @animation
- [ ] #polish Create visual feedback for all user interactions: @ux
  - [ ] Button press effects @feedback
  - [ ] Score updates @feedback
  - [ ] Game state changes @feedback
- [ ] #polish Add responsive design considerations: @responsive
  - [ ] Adapt layout for different screen sizes @layout
  - [ ] Maintain aspect ratio of game canvas @layout
  - [ ] Adjust control sizes for mobile devices @mobile
  - [ ] Ensure text readability across devices @typography
- [ ] #polish Enhance User Interface: @ui
  - [ ] Clear game instructions @ux
  - [ ] Intuitive control layout @ux
  - [ ] Consistent button styling @design
  - [ ] Visual hierarchy in information display @design

### 10. Performance Optimization and Technical Improvements

- [ ] #perf Optimize render loop for smooth gameplay: @performance
  - [ ] Efficient canvas drawing operations @rendering
  - [ ] Appropriate game loop timing @timing
  - [ ] Frame rate consistency @rendering
- [ ] #perf Implement efficient collision detection algorithms @algorithms
- [ ] #perf Minimize DOM operations during gameplay @performance
- [ ] #perf Optimize event listener management @performance
- [ ] #perf Use appropriate data structures for game state @data
- [ ] #perf Implement proper cleanup for timers and events @memory

### 11. Accessibility Enhancements

- [ ] #a11y Add keyboard navigation support @accessibility
- [ ] #a11y Implement proper focus management @accessibility
- [ ] #a11y Include ARIA attributes for UI elements @accessibility
- [ ] #a11y Ensure sufficient color contrast @design
- [ ] #a11y Add clear visual feedback for all interactions @ux
- [ ] #a11y Include alternative control methods (keyboard and touch) @controls

### 12. Code Architecture and Best Practices

- [ ] #arch Organize code with logical file separation: @structure
  - [ ] Core game logic in script.js @js
  - [ ] Sound system in sounds.js @audio
  - [ ] Message handling in popup-messages.js @ui
- [ ] #arch Implement modular code organization within files @structure
- [ ] #arch Add comprehensive error handling @error-handling
- [ ] #arch Use consistent naming conventions @style
- [ ] #arch Add code comments for complex logic @documentation
- [ ] #arch Follow performance best practices @performance
- [ ] #arch Ensure cross-browser compatibility @compatibility

### 13. Deployment and Documentation

- [ ] #deploy Prepare files for deployment: @deployment
  - [ ] Ensure all code is properly formatted @style
  - [ ] Verify all features are working as expected @testing
  - [ ] Check that all files are properly linked @validation
- [ ] #docs Create comprehensive documentation: @documentation
  - [ ] README.md with game overview and features @docs
  - [ ] Code comments for complex logic @docs
  - [ ] Implementation guide (todo.md) @docs
  - [ ] User instructions in-game @ux
- [ ] #deploy Deploy to hosting platform @deployment
- [ ] #deploy Verify deployed version works correctly @validation

This guide provides all necessary tasks to implement a complete web-based Snake game. An AI developer should approach these tasks sequentially, implementing each section while maintaining code quality and following web development best practices. The resulting game will be responsive, accessible, and feature a modern take on the classic Snake game with enhanced visuals and gameplay features.

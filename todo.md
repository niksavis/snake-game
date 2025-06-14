# Snake Game Implementation Guide

## Overview

Create a classic Snake game with modern features such as responsive design, touch controls, sound effects, and special power-ups. This guide outlines all necessary tasks to build a complete web-based Snake game.

## Dependencies

- [ ] Use only vanilla JavaScript, CSS, and HTML (no external libraries or frameworks)
- [ ] Utilize Web Audio API for all sound effects and audio functionality
- [ ] Use browser Web APIs for all required functionality (localStorage, requestAnimationFrame, etc.)
- [ ] Avoid dependencies on external assets (images, audio files, fonts, etc.)
- [ ] Implement all game functionality within the browser environment

## Tasks

### 1. HTML Structure

- [ ] Create a basic HTML document with appropriate meta tags and favicon
- [ ] Implement three game screens: start screen, game screen, and game-over screen
- [ ] Add canvas element for the game rendering
- [ ] Set up UI elements: score display, pause button, and sound toggle

### 2. CSS Styling

- [ ] Create responsive layout that works on different screen sizes
- [ ] Style the game container, screens, buttons, and canvas
- [ ] Implement transitions for screen changes
- [ ] Create visual styling for game elements (snake, food, special items)
- [ ] Add visual feedback for user interactions

### 3. Game Initialization

- [ ] Set up event listener for DOM content loaded
- [ ] Initialize game variables and state
- [ ] Set up canvas and its context
- [ ] Create resize handler for responsive canvas
- [ ] Load high score from local storage
- [ ] Set up event listeners for buttons and keyboard

### 4. Core Game Mechanics

- [ ] Implement the main game loop with appropriate timing
- [ ] Create snake movement system with directional control
- [ ] Add collision detection (walls, self)
- [ ] Implement food generation at random positions
- [ ] Add scoring system when food is consumed
- [ ] Create game over condition and handling

### 5. Advanced Features

- [ ] Implement touch controls for mobile devices
- [ ] Create pause/resume functionality
- [ ] Add special food items with power-ups (speed boost, double points, growth)
- [ ] Create visual effects for power-ups
- [ ] Implement high score tracking with local storage

### 6. Sound System

- [ ] Create audio context and sound generation functions
- [ ] Implement different sounds for various game events
- [ ] Add sound toggle functionality
- [ ] Create fallback mechanisms for browsers without audio support
- [ ] Persist sound preferences

### 7. Game Polish

- [ ] Add debug functionality for development
- [ ] Implement smooth animations
- [ ] Create visual feedback for scoring
- [ ] Add responsive design considerations
- [ ] Test across different devices and browsers

### 8. Performance Optimization

- [ ] Optimize render loop for smooth gameplay
- [ ] Implement efficient collision detection
- [ ] Manage memory usage for long gameplay sessions
- [ ] Optimize for mobile devices

This guide provides all necessary tasks to implement a complete Snake game. The agentic AI should approach these tasks sequentially, implementing each section while maintaining code quality and following web development best practices.

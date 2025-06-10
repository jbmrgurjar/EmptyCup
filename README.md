# 3D Solar System Simulation

A web-based 3D simulation of the solar system using Three.js, featuring interactive planet speed controls and realistic orbital animations.

## Features

- 3D visualization of the Sun and all 8 planets
- Realistic orbital animations
- Individual planet speed controls
- Responsive design
- Lighting and camera effects
- Optional features:
  - Pause/Resume functionality
  - Background stars
  - Planet labels/tooltips
  - Dark/Light mode toggle
  - Interactive camera controls

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Technologies Used

- Three.js for 3D rendering
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite for development and building

## Controls

- Use the sliders in the control panel to adjust individual planet speeds
- Click the Pause/Resume button to control the animation
- Use mouse/touch controls to interact with the scene:
  - Left click + drag to rotate
  - Right click + drag to pan
  - Scroll to zoom

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
/
├── src/
│   ├── js/
│   │   ├── main.js
│   │   ├── planets.js
│   │   └── controls.js
│   ├── styles/
│   │   └── style.css
│   └── index.html
├── public/
│   └── textures/
├── package.json
└── README.md
``` 
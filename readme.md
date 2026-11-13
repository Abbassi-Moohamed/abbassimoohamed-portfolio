# Abbassi Moohamed - Interactive 3D Portfolio

An interactive, immersive 3D portfolio website built with **Three.js**, **Cannon.js**, and **Vite**. Explore projects through a drivable car in a 3D environment with post-processing effects, physics simulation, and interactive zones.

## Features

- **3D Interactive Environment** - Navigate using a drivable car (Arrow Keys or WASD)
- **Physics Simulation** - Realistic car dynamics with Cannon.js
- **Post-Processing Effects** - Blur and glow effects using Three.js composer
- **Responsive Design** - Works on desktop and mobile (touch controls)
- **Portfolio Sections** - Multiple zones showcasing projects and experience
- **Audio System** - Engine sounds, horns, and ambient effects with Howler.js
- **Debug Mode** - Full development inspector with dat.GUI
- **Optimized Assets** - Draco compression for 3D models

## Technologies

- **Three.js** - 3D graphics/WebGL rendering
- **Cannon.js** - Physics engine
- **Vite** - Modern build tool
- **GLSL Shaders** - Custom visual effects
- **GSAP** - Animation library
- **Howler.js** - Audio management

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run these commands:

```bash
# Install dependencies
npm install

# Serve at localhost:5173
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Controls

- **Arrow Keys / WASD** - Drive the car
- **Mouse** - Look around (click and drag)
- **Space / Ctrl** - Brake
- **#debug** - Open debug panel (append to URL)
- **#cybertruck** - Use CyberTruck variant

## Personal Information

**Name:** Abbassi Moohamed  
**Title:** Computer Engineer  
**Location:** Tunis, Tunisia  
**Email:** mouhamed.abbassi@esprit.tn  
**Phone:** +216 50 922 140

### Specializations
- Full-Stack Web Development
- 3D Visualization & Graphics
- Cloud Architecture & DevOps

### Key Skills
JavaScript, TypeScript, React, Next.js, Three.js, Node.js, NestJS, Angular, Docker, Firebase, GraphQL, MongoDB, PostgreSQL

## Customization

For detailed setup and customization instructions, see [PORTFOLIO_CONFIG.md](./PORTFOLIO_CONFIG.md)

### Quick Updates:
1. **Personal Info** - Edit `src/index.html` meta tags
2. **Dialogue Text** - Edit messages in `src/index.html`
3. **Portfolio Sections** - Modify `src/javascript/World/Sections/`
4. **3D Models** - Replace models in `static/models/`
5. **Social Links** - Update URLs in `src/index.html` and sections

## Project Structure

```
src/
├── javascript/
│   ├── Application.js
│   ├── World/
│   │   ├── Car.js
│   │   ├── Physics.js
│   │   ├── Controls.js
│   │   └── Sections/
│   └── Utils/
├── shaders/
├── style/
└── index.html

static/
├── models/
├── sounds/
└── draco/
```

## License

Designed and personalized for Abbassi Moohamed. See [license.md](./license.md) for the original MIT copyright notice and license terms.

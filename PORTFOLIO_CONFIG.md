# Portfolio Configuration Guide

## Your Information

**Name:** Abbassi Mouhamed  
**Title:** Computer Engineer  
**Location:** Tunis, Tunisia  
**Email:** mouhamed.abbassi@esprit.tn  
**Phone:** +216 50 922 140

### Professional Summary
Computer Engineer specializing in Full-Stack Web Development, 3D Visualization, and Cloud Architecture. Based in Tunis, Tunisia.

---

## Key Skills

### Programming Languages & Frameworks
- **Languages:** JavaScript, TypeScript, Java, SQL/NoSQL, PL/SQL, GraphQL
- **Frontend:** ReactJS, Next.js, Angular, Three.js
- **Backend:** ExpressJS, NestJS, Spring, Symfony
- **Databases:** MySQL, PostgreSQL, MongoDB, Firebase

### Technologies & Tools
- Docker, Jenkins, Linux, GitHub, Jira
- CI/CD, DevOps practices
- Firebase (Auth, Firestore, Storage)
- GraphQL & REST APIs

---

## Experience

### Feb - Aug 2025: Final Year Project — Full-Stack Development (Mashroom)
**Key Achievements:**
- Developed a complete 3D visualization ecosystem with marketplace
- Built 3D library as React Package and Web Components
- Integrated AR module for real-world visualization
- Stack: React, Next.js, Three.js, NestJS, Firebase, Docker

### Jul – Sep 2024: Intern — Next.js / Express.js Development (Somatel)
**Key Achievements:**
- Developed interactive dashboard for telecom users
- Designed real-time backend using GraphQL and Apollo Server
- Stack: Next.js 14, Express.js, GraphQL, Apollo, PostgreSQL

### Jun - Aug 2023: Intern — MERN Stack Development (Swift Code)
**Key Achievements:**
- Developed e-commerce platform for parapharmacies
- Implemented RESTful backend and dynamic UI
- Stack: MongoDB, Express.js, React.js, Node.js, Docker

---

## Academic Projects

### Jan - Apr 2024: Educational Platform (ESPRIT)
- Intelligent platform with AI features, task automation, personalized recommendations
- Stack: Angular, NestJS, Firebase

### Nov - Feb 2024: DevOps Project (ESPRIT)
- Full DevOps pipeline with Jenkins, Docker, SonarQube, Prometheus, Grafana
- Stack: Spring, ExpressJS, Angular, MongoDB

### Feb - May 2023: Project Management Platform (ESPRIT)
- Task management, progress tracking, document sharing, real-time notifications
- Stack: ReactJS, NestJS, MongoDB

---

## How to Update Your Portfolio

### 1. Update Personal Information
- Edit `src/index.html` - Update meta tags and title
- All metadata has been updated with your details

### 2. Customize Portfolio Sections
Edit `src/javascript/World/Sections/` to customize each section:
- **IntroSection.js** - Title/intro area
- **ProjectsSection.js** - Your projects showcase
- **InformationSection.js** - Bio and details
- **PlaygroundSection.js** - Interactive experiments
- **CrossroadsSection.js** - Navigation hub

### 3. Replace 3D Models
Models are stored in `static/models/`:
- `intro/` - Introduction area models
- `projects/` - Project showcase models
- `car/` - Drivable car models (default or cyberTruck)
- `playground/` - Interactive elements

### 4. Update Project Data
Edit `src/javascript/Resources.js` to update asset references for your projects.

### 5. Social Links
- Update `src/index.html` - GitHub link (currently points to https://github.com)
- Update contact information in dialogue or sections

### 6. Add Your Own Sections
Create new section files in `src/javascript/World/Sections/` following the existing pattern.

---

## Social Links to Update

- **GitHub:** https://github.com
- **Email:** mouhamed.abbassi@esprit.tn
- **Phone:** +216 50 922 140

---

## Available Commands

```bash
# Development server (auto-reload)
npm run dev

# Build for production
npm run build

# Debug mode
# Open in browser and add #debug to URL
# Example: http://localhost:5173/#debug

# CyberTruck variant
# Add #cybertruck to URL
# Example: http://localhost:5173/#cybertruck
```

---

## Structure Overview

```
src/
├── javascript/
│   ├── Application.js          # Main app controller
│   ├── Camera.js               # 3D camera system
│   ├── ThreejsJourney.js       # Welcome dialogue/chat
│   ├── World/
│   │   ├── index.js            # Scene manager
│   │   ├── Car.js              # Drivable vehicle
│   │   ├── Physics.js          # Cannon.js integration
│   │   ├── Controls.js         # Input handling
│   │   ├── Areas.js            # Clickable regions
│   │   ├── Zones.js            # Spatial triggers
│   │   └── Sections/           # Portfolio sections
│   └── Utils/
│       ├── EventEmitter.js     # Event system
│       ├── Loader.js           # Asset loader
│       ├── Time.js             # Animation loop
│       └── Sizes.js            # Viewport manager
├── shaders/                    # GLSL shader files
├── style/main.css              # Styling
└── index.html                  # Entry HTML

static/
├── models/                     # 3D models (GLB format)
├── sounds/                     # Audio files
└── draco/                      # Compression library
```

---

## Next Steps

1. **Test locally** - Run `npm run dev` and navigate with arrow keys
2. **Customize sections** - Add your project descriptions and models
3. **Update links** - Add GitHub, LinkedIn, portfolio links
4. **Deploy** - Build with `npm run build` and deploy the `dist/` folder

---

## Notes

- All text shown in dialogue/chat bubble is in `src/index.html`
- The car can be driven with Arrow Keys or WASD
- Mobile users get touch controls
- Debug mode available via `#debug` URL hash
- Assets use Draco compression for optimization
- Post-processing effects (blur, glow) can be adjusted in `Application.js`

---

**Last Updated:** December 2025

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class SolarSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
        this.planets = new Map();
        this.isAnimating = true;
        this.speedMultipliers = new Map();
        
        this.init();
        this.createLights();
        this.createPlanets();
        this.createStars();
        this.setupControls();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        this.camera.position.z = 50;
        this.camera.position.y = 30;
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 3, 300);
        this.scene.add(sunLight);
    }

    createPlanets() {
        // Sun
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(sun);

        // Planet data: [size, distance from sun, orbit speed, color]
        const planetData = {
            mercury: [0.4, 8, 4.787, 0x8c8c8c],
            venus: [0.9, 11, 3.502, 0xe39e1c],
            earth: [1, 15, 2.978, 0x2b82ed],
            mars: [0.5, 19, 2.407, 0xc1440e],
            jupiter: [3, 30, 1.307, 0xd8ca9d],
            saturn: [2.5, 38, 0.969, 0xead6b8],
            uranus: [1.8, 45, 0.681, 0xd1e7e7],
            neptune: [1.7, 50, 0.543, 0x2b77ff]
        };

        for (const [name, [size, distance, speed, color]] of Object.entries(planetData)) {
            const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({ color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            const orbitGeometry = new THREE.BufferGeometry();
            const orbitPoints = [];
            for (let i = 0; i <= 360; i++) {
                const angle = (i * Math.PI) / 180;
                orbitPoints.push(new THREE.Vector3(
                    Math.cos(angle) * distance,
                    0,
                    Math.sin(angle) * distance
                ));
            }
            orbitGeometry.setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            
            this.scene.add(orbit);
            this.scene.add(planet);
            
            this.planets.set(name, {
                mesh: planet,
                distance,
                speed,
                angle: Math.random() * Math.PI * 2
            });
            this.speedMultipliers.set(name, 1);
        }
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        
        const starsVertices = [];
        for (let i = 0; i < 5000; i++) {
            const x = THREE.MathUtils.randFloatSpread(500);
            const y = THREE.MathUtils.randFloatSpread(500);
            const z = THREE.MathUtils.randFloatSpread(500);
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // UI Controls
        document.getElementById('toggle-animation').addEventListener('click', () => this.toggleAnimation());
        document.getElementById('toggle-theme').addEventListener('click', () => this.toggleTheme());
        
        // Planet speed controls
        this.planets.forEach((_, name) => {
            const slider = document.getElementById(`${name}-speed`);
            const speedValue = slider.nextElementSibling;
            
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.speedMultipliers.set(name, value);
                speedValue.textContent = `${value}x`;
            });
        });
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        const button = document.getElementById('toggle-animation');
        button.textContent = this.isAnimating ? 'Pause' : 'Resume';
    }

    toggleTheme() {
        document.body.setAttribute('data-theme',
            document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
        );
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isAnimating) {
            const delta = this.clock.getDelta();
            
            this.planets.forEach((planet, name) => {
                const speedMultiplier = this.speedMultipliers.get(name);
                planet.angle += delta * planet.speed * speedMultiplier * 0.5;
                
                planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
                
                // Planet rotation
                planet.mesh.rotation.y += delta * speedMultiplier;
            });
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the solar system when the page loads
window.addEventListener('load', () => {
    new SolarSystem();
}); 
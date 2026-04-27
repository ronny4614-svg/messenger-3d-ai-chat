// 3D Animation using Three.js
let scene, camera, renderer, cube;

function initAnimation() {
    const container = document.getElementById('animation');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x667eea);
    
    // Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create 3D JSON cube animation
    createJSONCube();
    
    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createJSONCube() {
    // JSON data for the cube
    const jsonData = {
        "ai": "powered",
        "chat": "realtime",
        "3d": "animation",
        "web": "modern",
        "socket": "connected",
        "users": "online"
    };
    
    // Create cube geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Create materials with gradient effect
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0x667eea, metalness: 0.7, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x764ba2, metalness: 0.7, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x5a67d8, metalness: 0.7, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x6b46c1, metalness: 0.7, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x553399, metalness: 0.7, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.7, roughness: 0.2 })
    ];
    
    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    
    // Add rotating particles around cube
    createParticles();
}

function createParticles() {
    const particleCount = 50;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            metalness: 0.8,
            roughness: 0.2
        });
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position around cube
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 4;
        particle.position.x = Math.cos(angle) * radius;
        particle.position.y = Math.sin(angle) * radius;
        particle.position.z = Math.sin(angle * 2) * radius;
        
        particle.userData = {
            angle: angle,
            radius: radius,
            speed: Math.random() * 0.01 + 0.005
        };
        
        particles.add(particle);
    }
    
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate cube
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.005;
        
        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        cube.scale.set(scale, scale, scale);
    }
    
    // Animate particles
    scene.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
            child.children.forEach((particle) => {
                if (particle.userData.angle !== undefined) {
                    particle.userData.angle += particle.userData.speed;
                    const angle = particle.userData.angle;
                    const radius = particle.userData.radius;
                    particle.position.x = Math.cos(angle) * radius;
                    particle.position.y = Math.sin(angle) * radius;
                    particle.position.z = Math.sin(angle * 2) * radius;
                    particle.rotation.x += 0.01;
                    particle.rotation.y += 0.01;
                }
            });
        }
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('animation');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Initialize animation when DOM is ready
document.addEventListener('DOMContentLoaded', initAnimation);

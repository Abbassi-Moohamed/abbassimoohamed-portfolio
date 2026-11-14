import * as THREE from 'three'
import Project from './Project'
import gsap from 'gsap'
import palette from '../../Palette.js'

export default class ProjectsSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.camera = _options.camera
        this.passes = _options.passes
        this.objects = _options.objects
        this.areas = _options.areas
        this.zones = _options.zones
        this.tiles = _options.tiles
        this.panel = _options.panel
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('projects')
            this.debugFolder.open()
        }

        // Set up
        this.items = []

        this.interDistance = 24
        this.positionRandomess = 5
        this.projectHalfWidth = 9

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setGeometries()
        this.setMeshes()
        this.setList()
        this.setZone()

        // Add all project from the list
        for(const _options of this.list)
        {
            this.add(_options)
        }
    }

    setGeometries()
    {
        this.geometries = {}
        this.geometries.floor = new THREE.PlaneGeometry(16, 8)
    }

    setMeshes()
    {
        this.meshes = {}

        // this.meshes.boardStructure = this.objects.getConvertedMesh(this.resources.items.projectsBoardStructure.scene.children, { floorShadowTexture: this.resources.items.projectsBoardStructureFloorShadowTexture })
        this.resources.items.areaOpenTexture.magFilter = THREE.NearestFilter
        this.resources.items.areaOpenTexture.minFilter = THREE.LinearFilter
        this.meshes.boardPlane = this.resources.items.projectsBoardPlane.scene.children[0]
        this.meshes.areaLabel = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: palette.floorText, alphaMap: this.resources.items.areaOpenTexture }))
        this.meshes.areaLabel.matrixAutoUpdate = false
    }

    setList()
    {
        const floorTexture = this.resources.items.projectsPortfolioFloorTexture
        const createInspectArea = () => ({
            x: - 4.8,
            y: - 3,
            halfExtents: { x: 3.2, y: 1.5 }
        })

        this.list = [
            {
                name: 'Frame Beauty',
                eyebrow: 'FOUNDER / FULL-STACK ENGINEER / 2026-PRESENT',
                description: 'A mobile-first SaaS platform for beauty businesses, combining a social feed, short-form video, appointments, live queues, service workflows, and a business marketplace.',
                contribution: 'Founded and built the full-stack product, including real-time workflows, secure access, and automated delivery.',
                technologies: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'Socket.IO', 'Firebase Cloud Messaging', 'Docker'],
                imageSources: ['./models/projects/abbassi/frame-beauty.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            },
            {
                name: 'Mashroom 3D Ecosystem',
                eyebrow: 'FINAL-YEAR PROJECT / FEB-AUG 2025',
                description: 'A 3D visualization ecosystem with a SaaS marketplace for 3D models, a framework-agnostic 3D library, and augmented-reality experiences.',
                contribution: 'Developed the 3D ecosystem, reusable library and Web Components, marketplace, and AR module.',
                technologies: ['React', 'Next.js', 'Three.js', 'Web Components', 'NestJS', 'Firebase', 'Docker'],
                imageSources: ['./models/projects/abbassi/mashroom.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            },
            {
                name: 'Somatel Telecom Dashboard',
                eyebrow: 'SOFTWARE DEVELOPMENT INTERN / JUL-SEP 2024',
                description: 'A real-time telecom service operations dashboard for teams monitoring and managing client network services.',
                contribution: 'Developed interactive back-office tools and a real-time backend using GraphQL and Apollo Server.',
                technologies: ['Next.js 14', 'Apollo Client', 'Express', 'GraphQL', 'PostgreSQL'],
                imageSources: ['./models/projects/abbassi/somatel.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            },
            {
                name: 'Swift Code E-commerce',
                eyebrow: 'MERN STACK INTERN / JUN-AUG 2023',
                description: 'An e-commerce platform for parapharmacies, supporting product discovery, shopping carts, and online ordering.',
                contribution: 'Developed the full-stack application, including its REST backend and dynamic user interface.',
                technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Docker'],
                imageSources: ['./models/projects/abbassi/swift-code.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            },
            {
                name: 'Driving License Microservices',
                eyebrow: 'ACADEMIC PROJECT / OCT 2023-JAN 2024',
                description: 'A distributed driving-license platform for registration, exam scheduling, reminders, progress tracking, and training history.',
                contribution: 'Designed and implemented the service-based workflows, service discovery, API gateway, and asynchronous messaging.',
                technologies: ['Spring', 'Angular', 'Eureka', 'RabbitMQ', 'JWT/OAuth2', 'Docker'],
                imageSources: ['./models/projects/abbassi/microservices.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            },
            {
                name: 'Educational Platform',
                eyebrow: 'ACADEMIC PROJECT / JAN-APR 2024',
                description: 'A personalized learning platform with task automation, progress tracking, recommendations, and a conversational chatbot.',
                contribution: 'Built an intelligent platform with AI-assisted features, task automation, and personalized recommendations.',
                technologies: ['Angular', 'NestJS', 'Firebase Authentication', 'Firestore'],
                imageSources: ['./models/projects/abbassi/education-platform.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            },
            {
                name: 'DevOps CI/CD Pipeline',
                eyebrow: 'ESPRIT DEVOPS PROJECT / NOV 2023-FEB 2024',
                description: 'An automated build and deployment workflow with build notifications, artifact management, and quality monitoring.',
                contribution: 'Built the CI/CD pipeline and quality and observability workflow for automated delivery.',
                technologies: ['Jenkins', 'Docker', 'Nexus', 'SonarQube', 'Prometheus', 'Grafana'],
                imageSources: ['./models/projects/abbassi/devops-pipeline.svg'],
                floorTexture,
                link: createInspectArea(),
                distinctions: []
            }
        ]
    }

    setZone()
    {
        const totalWidth = this.list.length * (this.interDistance / 2)

        const zone = this.zones.add({
            position: { x: this.x + totalWidth - this.projectHalfWidth - 6, y: this.y },
            halfExtents: { x: totalWidth, y: 12 },
            data: { cameraAngle: 'projects' }
        })

        zone.on('in', (_data) =>
        {
            this.camera.angle.set(_data.cameraAngle)
            gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2 })
            gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2 })
        })

        zone.on('out', () =>
        {
            this.camera.angle.set('default')
            gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: this.passes.horizontalBlurPass.strength, duration: 2 })
            gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: this.passes.verticalBlurPass.strength, duration: 2 })
        })
    }

    add(_options)
    {
        const x = this.x + this.items.length * this.interDistance
        let y = this.y
        if(this.items.length > 0)
        {
            y += (Math.random() - 0.5) * this.positionRandomess
        }

        // Create project
        const project = new Project({
            time: this.time,
            resources: this.resources,
            objects: this.objects,
            areas: this.areas,
            panel: this.panel,
            geometries: this.geometries,
            meshes: this.meshes,
            debug: this.debugFolder,
            x: x,
            y: y,
            ..._options
        })

        this.container.add(project.container)

        // Add tiles
        if(this.items.length >= 1)
        {
            const previousProject = this.items[this.items.length - 1]
            const start = new THREE.Vector2(previousProject.x + this.projectHalfWidth, previousProject.y)
            const end = new THREE.Vector2(project.x - this.projectHalfWidth, project.y)
            const delta = end.clone().sub(start)
            this.tiles.add({
                start: start,
                delta: delta
            })
        }

        // Save
        this.items.push(project)
    }
}

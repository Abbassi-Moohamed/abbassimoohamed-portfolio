import * as THREE from 'three'
import palette from '../../Palette.js'

export default class InformationSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.objects = _options.objects
        this.areas = _options.areas
        this.panel = _options.panel
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setStatic()
        this.setEngineeringStations()
        this.setLinks()
        this.setActivities()
        this.setTiles()
    }

    createInstagramTexture(_sourceTexture)
    {
        const image = _sourceTexture.image
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height

        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const mainColor = new THREE.Color(palette.indigo).convertLinearToSRGB()

        for(let y = 0; y < canvas.height; y++)
        {
            for(let x = 0; x < canvas.width; x++)
            {
                const index = (y * canvas.width + x) * 4
                const red = imageData.data[index]
                const green = imageData.data[index + 1]
                const blue = imageData.data[index + 2]
                const brightness = Math.min(red, green, blue)
                const saturation = Math.max(red, green, blue) - brightness

                if(brightness > 225 && saturation < 24)
                {
                    continue
                }

                imageData.data[index] = mainColor.r * 255
                imageData.data[index + 1] = mainColor.g * 255
                imageData.data[index + 2] = mainColor.b * 255
            }
        }

        context.putImageData(imageData, 0, 0)

        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.flipY = _sourceTexture.flipY
        texture.needsUpdate = true

        return texture
    }

    setStatic()
    {
        const base = this.resources.items.informationStaticBase.scene.clone(true)
        const collision = this.resources.items.informationStaticCollision.scene.clone(true)
        const missingParts = []
        const removePart = (_root, _name) =>
        {
            const parts = []
            _root.traverse((_part) =>
            {
                if(_part.name === _name)
                {
                    parts.push(_part)
                }
            })

            if(!parts.length)
            {
                missingParts.push(_name)
                return
            }

            for(const part of parts)
            {
                part.parent.remove(part)
            }
        }

        removePart(collision, 'Cube.067')

        if(missingParts.length)
        {
            console.warn(`Information scene is missing expected model parts: ${missingParts.join(', ')}`)
        }

        const instagram = this.resources.items.informationInstagramModel.scene
        let instagramMesh
        instagram.traverse((_part) =>
        {
            if(!instagramMesh && _part.isMesh)
            {
                instagramMesh = _part
            }
        })

        const instagramBacking = base.getObjectByName('shadeWhite_033')
        const instagramMaterial = instagramMesh && (Array.isArray(instagramMesh.material) ? instagramMesh.material[0] : instagramMesh.material)
        const instagramTexture = instagramMaterial && instagramMaterial.map
        if(!instagramMesh || !instagramBacking || !instagramTexture)
        {
            console.warn('Information scene is missing the Instagram model, texture, or social-icon backing')
        }
        else
        {
            const backingBounds = new THREE.Box3().setFromObject(instagramBacking)
            instagramMesh = instagramMesh.clone()
            instagramMesh.name = 'shadeOrange'
            const tintedTexture = this.createInstagramTexture(instagramTexture)
            instagramMesh.material = new THREE.MeshBasicMaterial({
                map: tintedTexture,
                side: THREE.DoubleSide
            })
            instagramMesh.geometry.computeBoundingBox()

            const instagramRotation = new THREE.Euler(Math.PI / 2, 0, 0)
            const modelBounds = instagramMesh.geometry.boundingBox.clone()
            modelBounds.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(instagramRotation))
            const modelSize = modelBounds.getSize(new THREE.Vector3())
            const backingSize = backingBounds.getSize(new THREE.Vector3())
            const backingCenter = backingBounds.getCenter(new THREE.Vector3())
            const instagramSize = Math.max(modelSize.x, modelSize.z)
            const linkedInBacking = base.getObjectByName('shadeWhite.115')
            const linkedInIcon = base.getObjectByName('shadeOrange.003')
            const targetSize = linkedInIcon
                ? new THREE.Box3().setFromObject(linkedInIcon).getSize(new THREE.Vector3()).x
                : linkedInBacking
                    ? new THREE.Box3().setFromObject(linkedInBacking).getSize(new THREE.Vector3()).x * 0.82
                    : backingSize.x * 0.82
            const scale = targetSize / instagramSize

            instagramMesh.scale.set(scale * 1.25, scale, scale * 5)
            instagramMesh.rotation.copy(instagramRotation)
            instagramMesh.position.set(
                backingCenter.x - modelBounds.getCenter(new THREE.Vector3()).x * scale,
                backingCenter.y - modelBounds.getCenter(new THREE.Vector3()).y * scale,
                backingBounds.max.z + 0.01 - modelBounds.min.z * scale
            )
        }

        const flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4667))
        flagMesh.name = 'abbassiTunisiaFlag'
        flagMesh.position.set(- 3.1306, 5.025, 2.67)
        flagMesh.rotation.x = Math.PI / 2
        base.add(flagMesh)

        const staticObject = this.objects.add({
            base,
            collision,
            floorShadowTexture: this.resources.items.informationStaticFloorShadowTexture,
            offset: new THREE.Vector3(this.x, this.y, 0),
            duplicated: true,
            mass: 0
        })

        if(instagramMesh)
        {
            const center = staticObject.collision.center
            instagramMesh.position.sub(new THREE.Vector3(center.x, center.y, center.z))
            staticObject.container.add(instagramMesh)
        }

        const flagTexture = this.resources.items.informationTunisiaFlagTexture.clone()
        flagTexture.colorSpace = THREE.SRGBColorSpace
        flagTexture.needsUpdate = true
        staticObject.container.getObjectByName('abbassiTunisiaFlag').material = new THREE.MeshBasicMaterial({
            map: flagTexture,
            side: THREE.DoubleSide
        })
    }

    setEngineeringStations()
    {
        const stations = [
            {
                name: 'ABOUT ME',
                eyebrow: 'ENGINEERING HQ / PROFILE',
                description: 'Abbassi Mouhamed is a Computer Engineer and Full-Stack Developer based in Tunis, Tunisia.',
                highlights: [
                    'Building scalable applications and real-time systems.',
                    'Focus areas include full-stack engineering, 3D visualization, cloud architecture, and automation.'
                ],
                technologies: ['Full-Stack Development', '3D Visualization', 'Cloud Architecture', 'DevOps'],
                screenLine: 'PROFILE / COMPUTER ENGINEER / TUNIS'
            },
            {
                name: 'EXPERIENCE',
                eyebrow: 'ENGINEERING HQ / PROFESSIONAL TIMELINE',
                description: 'Professional experience across 3D software, telecom operations, and full-stack e-commerce.',
                highlights: [
                    'Mashroom | Final-Year Project | Feb-Aug 2025: 3D visualization ecosystem, reusable library, marketplace, and AR experiences.',
                    'Somatel | Software Development Intern | Jul-Sep 2024: telecom dashboard and real-time GraphQL backend.',
                    'Swift Code | MERN Stack Intern | Jun-Aug 2023: parapharmacy e-commerce application and REST backend.'
                ],
                screenLine: 'MASHROOM / SOMATEL / SWIFT CODE'
            },
            {
                name: 'TECHNICAL SKILLS',
                eyebrow: 'ENGINEERING HQ / CAPABILITY MATRIX',
                description: 'Explore the technologies and engineering disciplines used across my projects.',
                highlights: [
                    'Frontend: React, Next.js, Angular, TypeScript',
                    'Backend: Node.js, Express, NestJS, Spring, Symfony, GraphQL, REST',
                    'Databases: PostgreSQL, MySQL, MongoDB, Firebase, Firestore',
                    'Architecture: Microservices, API gateways, service discovery, Web Components',
                    'Real-Time: Socket.IO, GraphQL subscriptions, real-time dashboards',
                    'DevOps and Cloud: Docker, Jenkins, CI/CD, Linux, Firebase, cloud services',
                    '3D Development: Three.js, GLSL, WebGL, AR visualization',
                    'AI and Automation: recommendations, task automation, AI-assisted learning'
                ],
                screenLine: 'FRONTEND / BACKEND / DATA / 3D / DEVOPS'
            }
        ]

        const baseGeometry = new THREE.BoxGeometry(2.4, 0.9, 0.28)
        const standGeometry = new THREE.BoxGeometry(0.34, 0.3, 1.1)
        const screenHousingGeometry = new THREE.BoxGeometry(3.5, 0.24, 2.15)
        const frameMaterial = new THREE.MeshBasicMaterial({ color: palette.steelGrey })
        const baseMaterial = new THREE.MeshBasicMaterial({ color: palette.graphite })
        const screenGeometry = new THREE.PlaneGeometry(3.18, 1.83)

        for(let i = 0; i < stations.length; i++)
        {
            const station = stations[i]
            const x = this.x + 7 + i * 8
            const y = this.y + 8
            const terminal = new THREE.Group()
            terminal.position.set(x, y, 0)

            const base = new THREE.Mesh(baseGeometry, baseMaterial)
            base.position.z = 0.18
            terminal.add(base)

            const stand = new THREE.Mesh(standGeometry, frameMaterial)
            stand.position.z = 0.85
            terminal.add(stand)

            const housing = new THREE.Mesh(screenHousingGeometry, frameMaterial)
            housing.position.z = 2.4
            terminal.add(housing)

            const canvas = document.createElement('canvas')
            canvas.width = 768
            canvas.height = 440
            const context = canvas.getContext('2d')
            context.fillStyle = palette.charcoal
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = i === 1 ? palette.indigo : palette.cyan
            context.fillRect(0, 0, 12, canvas.height)
            context.fillStyle = palette.warmSilver
            context.font = '600 27px Arial'
            context.fillText('ENGINEERING HQ / STATION 0' + (i + 1), 42, 66)
            context.fillStyle = palette.white
            context.font = '700 49px Arial'
            context.fillText(station.name, 42, 144)
            context.fillStyle = palette.silver
            context.font = '27px Arial'
            context.fillText(station.screenLine, 42, 224)
            context.fillText(station.description.slice(0, 48), 42, 270)
            context.fillStyle = palette.cyan
            context.fillRect(42, 324, 680, 3)
            context.fillStyle = palette.warmSilver
            context.font = '600 25px Arial'
            context.fillText('DRIVE CLOSE / PRESS E TO INSPECT', 42, 382)

            const screenTexture = new THREE.CanvasTexture(canvas)
            screenTexture.colorSpace = THREE.SRGBColorSpace
            screenTexture.anisotropy = 2
            const screen = new THREE.Mesh(
                screenGeometry,
                new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false, side: THREE.DoubleSide })
            )
            screen.position.set(0, -0.13, 2.4)
            screen.rotation.x = Math.PI * 0.5
            terminal.add(screen)
            this.container.add(terminal)

            const area = this.areas.add({
                position: new THREE.Vector2(x, y - 2.1),
                halfExtents: new THREE.Vector2(2.5, 1.8)
            })
            area.on('in', () =>
            {
                this.panel.showPrompt(station, area)
            })
            area.on('out', () =>
            {
                this.panel.hidePrompt(station)
            })
            area.on('interact', () =>
            {
                this.panel.open(station, area)
            })
        }
    }

    setLinks()
    {
        // Set up
        this.links = {}
        this.links.x = 1.95
        this.links.y = - 1.5
        this.links.halfExtents = {}
        this.links.halfExtents.x = 0.75
        this.links.halfExtents.y = 1
        this.links.distanceBetween = 2.4
        this.links.labelWidth = 1.8
        this.links.labelGeometry = new THREE.PlaneGeometry(this.links.labelWidth, this.links.labelWidth * 0.25, 1, 1)
        this.links.labelOffset = - 1.6
        this.links.items = []

        this.links.container = new THREE.Object3D()
        this.links.container.matrixAutoUpdate = false
        this.container.add(this.links.container)

        // Options
        this.links.options = [
            {
                href: 'mailto:abbassimoohamed@gmail.com',
                labelTexture: this.resources.items.informationContactMailLabelTexture
            },
            {
                href: 'https://www.linkedin.com/in/abbassi-moohamed/',
                labelTexture: this.resources.items.informationContactLinkedinLabelTexture
            },
            {
                href: 'https://github.com/Abbassi-Moohamed',
                labelTexture: this.resources.items.informationContactGithubLabelTexture
            },
            {
                href: 'https://www.instagram.com/abbassi.moohamed/',
                labelTexture: this.resources.items.informationContactInstagramLabelTexture
            }
        ]

        // Create each link
        let i = 0
        for(const _option of this.links.options)
        {
            // Set up
            const item = {}
            item.x = this.x + this.links.x + this.links.distanceBetween * i
            item.y = this.y + this.links.y
            item.href = _option.href

            // Create area
            item.area = this.areas.add({
                position: new THREE.Vector2(item.x, item.y),
                halfExtents: new THREE.Vector2(this.links.halfExtents.x, this.links.halfExtents.y)
            })
            item.area.on('interact', () =>
            {
                window.open(_option.href, '_blank')
            })

            // Texture
            item.texture = _option.labelTexture
            item.texture.magFilter = THREE.NearestFilter
            item.texture.minFilter = THREE.LinearFilter

            // Create label
            item.labelMesh = new THREE.Mesh(this.links.labelGeometry, new THREE.MeshBasicMaterial({ wireframe: false, color: palette.floorText, alphaMap: _option.labelTexture, depthTest: true, depthWrite: false, transparent: true }))
            item.labelMesh.position.x = item.x + this.links.labelWidth * 0.5 - this.links.halfExtents.x
            item.labelMesh.position.y = item.y + this.links.labelOffset
            item.labelMesh.matrixAutoUpdate = false
            item.labelMesh.updateMatrix()
            this.links.container.add(item.labelMesh)

            // Save
            this.links.items.push(item)

            i++
        }
    }

    setActivities()
    {
        // Set up
        this.activities = {}
        this.activities.x = this.x + 0
        this.activities.y = this.y - 10
        this.activities.multiplier = 5.5

        // Geometry
        this.activities.geometry = new THREE.PlaneGeometry(2 * this.activities.multiplier, 1 * this.activities.multiplier, 1, 1)

        // Texture
        this.activities.texture = this.resources.items.informationActivitiesTexture
        this.activities.texture.magFilter = THREE.NearestFilter
        this.activities.texture.minFilter = THREE.LinearFilter

        // Material
        this.activities.material = new THREE.MeshBasicMaterial({ wireframe: false, color: palette.floorText, alphaMap: this.activities.texture, transparent: true })

        // Mesh
        this.activities.mesh = new THREE.Mesh(this.activities.geometry, this.activities.material)
        this.activities.mesh.position.x = this.activities.x
        this.activities.mesh.position.y = this.activities.y
        this.activities.mesh.matrixAutoUpdate = false
        this.activities.mesh.updateMatrix()
        this.container.add(this.activities.mesh)
    }

    setTiles()
    {
        this.tiles.add({
            start: new THREE.Vector2(this.x - 1.2, this.y + 13),
            delta: new THREE.Vector2(0, - 20)
        })
    }
}

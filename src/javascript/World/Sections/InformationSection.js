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
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setStatic()
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
        const mainColor = new THREE.Color(palette.mutedCopper).convertLinearToSRGB()

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
            item.labelMesh = new THREE.Mesh(this.links.labelGeometry, new THREE.MeshBasicMaterial({ wireframe: false, color: palette.silver, alphaMap: _option.labelTexture, depthTest: true, depthWrite: false, transparent: true }))
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
        this.activities.material = new THREE.MeshBasicMaterial({ wireframe: false, color: palette.silver, alphaMap: this.activities.texture, transparent: true })

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

import * as THREE from 'three'
import palette from '../../Palette.js'

export default class CrossroadsSection
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
        this.setTiles()
        this.setNavigationSigns()
    }

    setStatic()
    {
        this.objects.add({
            base: this.resources.items.crossroadsStaticBase.scene,
            collision: this.resources.items.crossroadsStaticCollision.scene,
            floorShadowTexture: this.resources.items.crossroadsStaticFloorShadowTexture,
            offset: new THREE.Vector3(this.x, this.y, 0),
            mass: 0
        })
    }

    setTiles()
    {
        // To intro
        this.tiles.add({
            start: new THREE.Vector2(this.x, - 10),
            delta: new THREE.Vector2(0, this.y + 14)
        })

        // To projects
        this.tiles.add({
            start: new THREE.Vector2(this.x + 12.5, this.y),
            delta: new THREE.Vector2(7.5, 0)
        })

        // To projects
        this.tiles.add({
            start: new THREE.Vector2(this.x - 13, this.y),
            delta: new THREE.Vector2(- 6, 0)
        })
    }

    setNavigationSigns()
    {
        const createSign = (_title, _subtitle, _x, _y, _accent) =>
        {
            const canvas = document.createElement('canvas')
            canvas.width = 768
            canvas.height = 224
            const context = canvas.getContext('2d')

            context.fillStyle = '#0D111B'
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.fillStyle = _accent
            context.fillRect(0, 0, 12, canvas.height)
            context.fillStyle = '#F1F5F9'
            context.font = '700 54px Arial'
            context.fillText(_title, 42, 94)
            context.fillStyle = '#94A3B8'
            context.font = '600 30px Arial'
            context.fillText(_subtitle, 44, 158)

            const texture = new THREE.CanvasTexture(canvas)
            texture.colorSpace = THREE.SRGBColorSpace
            texture.anisotropy = 2

            const sign = new THREE.Group()
            sign.position.set(this.x + _x, this.y + _y, 0)
            const postMaterial = new THREE.MeshBasicMaterial({ color: palette.steelGrey })
            const boardMaterial = new THREE.MeshBasicMaterial({ color: palette.graphite })
            const postGeometry = new THREE.BoxGeometry(0.14, 0.14, 2.3)
            const boardGeometry = new THREE.BoxGeometry(4.5, 0.22, 1.5)

            for(const _postX of [-1.85, 1.85])
            {
                const post = new THREE.Mesh(postGeometry, postMaterial)
                post.position.set(_postX, 0, 1.15)
                sign.add(post)
            }

            const board = new THREE.Mesh(boardGeometry, boardMaterial)
            board.position.set(0, 0, 2.25)
            sign.add(board)

            const label = new THREE.Mesh(
                new THREE.PlaneGeometry(4.25, 1.24),
                new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, toneMapped: false })
            )
            label.position.set(0, -0.116, 2.25)
            label.rotation.x = Math.PI * 0.5
            sign.add(label)
            this.container.add(sign)
        }

        createSign('PROJECTS  >', 'PRODUCT EXHIBITION DISTRICT', 6, 0, palette.cyan)
        createSign('<  PLAYGROUND', 'OPTIONAL PHYSICS PLAY AREA', -6, 0, palette.indigo)
        createSign('ENGINEERING HQ  v', 'ABOUT / EXPERIENCE / TECHNICAL SKILLS / CONTACT', 7, -7, palette.cyan)
    }
}

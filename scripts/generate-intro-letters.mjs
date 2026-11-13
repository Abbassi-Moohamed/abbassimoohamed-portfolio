import fs from 'fs'
import path from 'path'
import * as THREE from 'three'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import opentype from 'three/examples/jsm/libs/opentype.module.js'

class FileReaderPolyfill
{
    readAsArrayBuffer(_blob)
    {
        _blob.arrayBuffer().then((_buffer) =>
        {
            this.result = _buffer
            if(this.onloadend)
            {
                this.onloadend()
            }
        })
    }

    readAsDataURL(_blob)
    {
        _blob.arrayBuffer().then((_buffer) =>
        {
            this.result = `data:${_blob.type};base64,${Buffer.from(_buffer).toString('base64')}`
            if(this.onloadend)
            {
                this.onloadend()
            }
        })
    }
}

globalThis.FileReader = globalThis.FileReader || FileReaderPolyfill

const name = 'ABBASSI MOOHAMED'
const fontSize = 0.95
const targetCenterX = - 0.095
const lineY = - 9.481
const depth = 0.36
const bevelThickness = 0.09
const bevelSize = 0.009
const bevelSegments = 2
const curveSegments = 12
const emScale = 1.3889
const modelsRoot = 'static/models/intro'
const layoutPath = 'src/javascript/World/Sections/introName.js'

const fontBuffer = fs.readFileSync('resources/fonts/Oswald-Bold.ttf')
const arrayBuffer = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength)
const typeface = new TTFLoader().parse(arrayBuffer)
const font = new FontLoader().parse(typeface)
const otFont = opentype.parse(arrayBuffer)

const exporter = new GLTFExporter()

const textOptions = {
    font,
    size: fontSize,
    depth,
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelSegments,
    curveSegments
}

const letters = [...new Set(name.replace(/ /g, ''))]
const letterData = {}

const exportScene = (_scene, _path) =>
{
    return new Promise((_resolve, _reject) =>
    {
        exporter.parse(_scene, (_result) =>
        {
            fs.mkdirSync(path.dirname(_path), { recursive: true })
            fs.writeFileSync(_path, Buffer.from(_result))
            _resolve()
        }, _reject, { binary: true })
    })
}

const buildLetter = async (_char) =>
{
    const geometry = new TextGeometry(_char, textOptions)
    geometry.rotateX(Math.PI / 2)
    geometry.translate(0, depth / 2, 0)
    geometry.computeBoundingBox()

    const box = geometry.boundingBox
    const centerX = (box.min.x + box.max.x) / 2
    geometry.translate(- centerX, 0, 0)
    geometry.computeBoundingBox()

    const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
    const height = geometry.boundingBox.max.z - geometry.boundingBox.min.z
    const depthSize = geometry.boundingBox.max.y - geometry.boundingBox.min.y
    const centerZ = (geometry.boundingBox.min.z + geometry.boundingBox.max.z) / 2

    const baseScene = new THREE.Scene()
    const baseMesh = new THREE.Mesh(geometry)
    baseMesh.name = 'shadeWhite.001'
    baseScene.add(baseMesh)

    const collisionScene = new THREE.Scene()
    const collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
    collisionMesh.name = 'Cube.001'
    collisionMesh.position.set(0, 0, centerZ)
    collisionMesh.scale.set(width, depthSize, height)
    collisionScene.add(collisionMesh)

    const centerObject = new THREE.Object3D()
    centerObject.name = 'center'
    centerObject.position.set(0, 0, centerZ)
    collisionScene.add(centerObject)

    const letterFolder = _char.toLowerCase()
    await exportScene(baseScene, `${modelsRoot}/${letterFolder}/base.glb`)
    await exportScene(collisionScene, `${modelsRoot}/${letterFolder}/collision.glb`)

    letterData[_char] = {
        halfWidth: width / 2,
        centerX,
        width,
        depth: depthSize,
        height,
        centerZ
    }
}

const layoutLetters = () =>
{
    const em = fontSize * emScale
    let pen = 0
    const items = []

    for(let i = 0; i < name.length; i++)
    {
        const char = name[i]

        if(char === ' ')
        {
            pen += otFont.getAdvanceWidth(char, em)
            continue
        }

        const data = letterData[char]
        const centerX = pen + data.centerX
        items.push({ letter: char, centerX, halfWidth: data.halfWidth })

        pen += otFont.getAdvanceWidth(char, em)

        if(i < name.length - 1)
        {
            const glyph = otFont.charToGlyph(char)
            const nextGlyph = otFont.charToGlyph(name[i + 1])
            pen += otFont.getKerningValue(glyph, nextGlyph) * em / otFont.unitsPerEm
        }
    }

    let min = Infinity
    let max = - Infinity

    for(const item of items)
    {
        min = Math.min(min, item.centerX - item.halfWidth)
        max = Math.max(max, item.centerX + item.halfWidth)
    }

    const shift = targetCenterX - (min + max) / 2

    return {
        lineY,
        letters: items.map((item) => ({
            letter: item.letter,
            x: +(item.centerX + shift).toFixed(4)
        }))
    }
}

const run = async () =>
{
    for(const char of letters)
    {
        await buildLetter(char)
    }

    const layout = layoutLetters()
    const layoutSource = `export default ${JSON.stringify(layout, null, 4)}\n`
    fs.writeFileSync(layoutPath, layoutSource)

    console.log('Generated letters:', letters.join(', '))
    console.log('Name width:', layout.letters.length, 'letters')
    console.log('Layout:', layoutPath)
}

run()

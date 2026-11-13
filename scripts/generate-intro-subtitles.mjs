import fs from 'fs'
import path from 'path'
import * as THREE from 'three'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

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

const fontSize = 0.55
const lineY = - 12.7
const targetCenterX = 2.2
const gap = 0.35
const depth = 0.36
const bevelThickness = 0.09
const bevelSize = 0.009
const bevelSegments = 2
const curveSegments = 12
const modelsRoot = 'static/models/intro/subtitles'
const layoutPath = 'src/javascript/World/Sections/introSubtitles.js'
const words = ['COMPUTER', 'ENGINEER']

const fontBuffer = fs.readFileSync('resources/fonts/Oswald-Bold.ttf')
const arrayBuffer = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength)
const typeface = new TTFLoader().parse(arrayBuffer)
const font = new FontLoader().parse(typeface)

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

const buildWord = async (_word) =>
{
    const geometry = new TextGeometry(_word, textOptions)
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
    baseMesh.name = 'shadeWhite.900'
    baseScene.add(baseMesh)

    const collisionScene = new THREE.Scene()
    const collisionMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
    collisionMesh.name = 'Cube.subtitle'
    collisionMesh.position.set(0, 0, centerZ)
    collisionMesh.scale.set(width, depthSize, height)
    collisionScene.add(collisionMesh)

    const centerObject = new THREE.Object3D()
    centerObject.name = 'center'
    centerObject.position.set(0, 0, centerZ)
    collisionScene.add(centerObject)

    const folder = _word.toLowerCase()
    await exportScene(baseScene, `${modelsRoot}/${folder}/base.glb`)
    await exportScene(collisionScene, `${modelsRoot}/${folder}/collision.glb`)

    return { word: _word, width, height, depth: depthSize, centerZ }
}

const run = async () =>
{
    const data = []

    for(const word of words)
    {
        data.push(await buildWord(word))
    }

    const totalWidth = data.reduce((_total, _item) => _total + _item.width, 0) + gap * (data.length - 1)
    let pen = targetCenterX - totalWidth / 2
    const layout = {
        lineY,
        words: data.map((_item) =>
        {
            const x = pen + _item.width / 2
            pen += _item.width + gap
            return { word: _item.word, x: +x.toFixed(4) }
        })
    }

    const layoutSource = `export default ${JSON.stringify(layout, null, 4)}\n`
    fs.writeFileSync(layoutPath, layoutSource)

    console.log('Generated subtitles:', data.map((_item) => `${_item.word} ${_item.width.toFixed(2)}x${_item.height.toFixed(2)}`).join(', '))
    console.log('Layout:', layout)
}

run()

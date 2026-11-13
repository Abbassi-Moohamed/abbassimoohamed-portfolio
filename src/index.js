import './style/main.css'
import Application from './javascript/Application.js'

const $canvas = document.querySelector('.js-canvas')
const $fallback = document.querySelector('.js-webgl-fallback')

try
{
    if(!$canvas.getContext('webgl2'))
    {
        throw new Error('WebGL 2 is unavailable.')
    }

    window.application = new Application({
        $canvas,
        useComposer: true
    })
}
catch(_error)
{
    console.error('Unable to initialize the 3D portfolio.', _error)
    $canvas.hidden = true
    $fallback.hidden = false
}

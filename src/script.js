import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Loader 
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load("/textures/golfpravi.png")
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry( .5, 64, 64)

const starfield = new THREE.BufferGeometry;
const starCount = 10000;

const starArray = new Float32Array(starCount * 3);

for(let i = 0; i < starCount*3; i++){
    starArray[i] = (Math.random() - 0.5) * 20;
}

starfield.setAttribute('position', new THREE.BufferAttribute(starArray, 3));
// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.9
material.roughness = 0.2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)

const starMaterial = new THREE.PointsMaterial({
    size: 0.005
})

// Mesh
const sphere = new THREE.Mesh(geometry,material)
const starMesh = new THREE.Points(starfield,starMaterial)
scene.add(sphere, starMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight1 = new THREE.PointLight(0xff0000, 2)
pointLight1.position.set(2.4,-2.2,-2)
pointLight1.intensity = 7.7
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x0000ff, 2)
pointLight2.position.set(-2,1,-0.5)
pointLight2.intensity = 7.7
scene.add(pointLight2)

gui.add(pointLight1.position, 'y').min(-3).max(3).step(0.1)
gui.add(pointLight1.position, 'x').min(-3).max(3).step(0.1)
gui.add(pointLight1.position, 'z').min(-3).max(3).step(0.1)
gui.add(pointLight1, 'intensity').min(-10).max(10).step(0.1)

gui.add(pointLight2.position, 'y').min(-3).max(3).step(0.1)
gui.add(pointLight2.position, 'x').min(-3).max(3).step(0.1)
gui.add(pointLight2.position, 'z').min(-3).max(3).step(0.1)
gui.add(pointLight2, 'intensity').min(-10).max(10).step(0.1)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowX
    mouseY = event.clientY - windowY
}

const updateSphere = (event) => {
    camera.position.x -= window.scrollY * .00004
    camera.position.z -= window.scrollY * .00007
}
const clock = new THREE.Clock()

document.addEventListener('scroll', updateSphere)



const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .6 * elapsedTime
    
    sphere.rotation.y = .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x = .5 * (targetY - sphere.rotation.x)
    sphere.rotation.z = .5 * (targetY - sphere.rotation.x)

    if(mouseX > 0){
        starMesh.position.y = .02 * elapsedTime
    }
    if(mouseY > 0){
        starMesh.position.x = .02 * elapsedTime
    }
    starMesh.rotation.x = -.01 * elapsedTime

    
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
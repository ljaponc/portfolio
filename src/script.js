import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { PointLight } from 'three'

//Loader 
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load("/textures/golfpravi.png")

const earthTexture = textureLoader.load('/textures/zemlja.jpg')

const moonTexture = textureLoader.load('/textures/moon.jpg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry( .5, 64, 64)

const geometry1 = new THREE.SphereBufferGeometry( .4, 64, 64)

const starfield = new THREE.BufferGeometry;
const starCount = 10000;

const starArray = new Float32Array(starCount * 3);

for(let i = 0; i < starCount*3; i++){
    starArray[i] = (Math.random() - 0.5) * 20;
}

starfield.setAttribute('position', new THREE.BufferAttribute(starArray, 3));


// Materials

//planet
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.9
material.roughness = 0.2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)

//stars
const starMaterial = new THREE.PointsMaterial({
    size: 0.005
})

//earth 
const earthMat = new THREE.MeshStandardMaterial({map: earthTexture})

//moon
const moonMat = new THREE.MeshBasicMaterial({map: moonTexture})


// Mesh
const sphere = new THREE.Mesh(geometry,earthMat)
const starMesh = new THREE.Points(starfield,starMaterial)
const moon = new THREE.Mesh(geometry1,moonMat)
moon.position.set(0,0,-5)
sphere.add(moon)
scene.add(sphere, starMesh)

// Lights
//white
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
pointLight.intensity = 1
scene.add(pointLight)

const white = gui.addFolder('lightWhite')

//red

const pointLight1 = new THREE.PointLight(0xff0000, 2)
pointLight1.position.set(2.4,-2.2,-2)
pointLight1.intensity = 7.7
// scene.add(pointLight1)

const red = gui.addFolder('lightRed')

//blue
const pointLight2 = new THREE.PointLight(0x0000ff, 2)
pointLight2.position.set(-2,1,-0.5)
pointLight2.intensity = 7.7
// scene.add(pointLight2)

const blue = gui.addFolder('lightBlue')

//folder imports
white.add(pointLight.position, 'y').min(-3).max(3).step(0.1)
white.add(pointLight.position, 'x').min(-3).max(3).step(0.1)
white.add(pointLight.position, 'z').min(-3).max(3).step(0.1)
white.add(pointLight, 'intensity').min(-10).max(10).step(0.1)

red.add(pointLight1.position, 'y').min(-3).max(3).step(0.1)
red.add(pointLight1.position, 'x').min(-3).max(3).step(0.1)
red.add(pointLight1.position, 'z').min(-3).max(3).step(0.1)
red.add(pointLight1, 'intensity').min(-10).max(10).step(0.1)

blue.add(pointLight2.position, 'y').min(-3).max(3).step(0.1)
blue.add(pointLight2.position, 'x').min(-3).max(3).step(0.1)
blue.add(pointLight2.position, 'z').min(-3).max(3).step(0.1)
blue.add(pointLight2, 'intensity').min(-10).max(10).step(0.1)

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

//add audio
const listener = new THREE.AudioListener()
camera.add(listener)

scene.add(camera)

//audio 
const sound = new THREE.Audio( listener );
//play audio 
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/sounds/space.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.1 );
	// sound.play();
});


const cameramain = gui.addFolder('camera')

cameramain.add(camera.position, 'y').min(-3).max(3).step(0.1)
cameramain.add(camera.position, 'x').min(-3).max(3).step(0.1)
cameramain.add(camera.position, 'z').min(-3).max(3).step(0.1)

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

    moon.rotation.y = 1 * elapsedTime

    if(mouseX > 0){
        starMesh.rotation.y = .02 * targetX
    }
    if(mouseY > 0){
        starMesh.rotation.x = .02 * targetY
    }
    starMesh.rotation.x = -.01 * elapsedTime
    starMesh.rotation.y = -.03 * elapsedTime

    
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
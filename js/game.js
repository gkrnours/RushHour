Math.TAU = Math.PI*2

var camera, scene, renderer
var mouseX = 0, mouseY = 0
var windowHalfX = window.innerWidth / 2
var windowHalfY = window.innerHeight / 2
var objs = {}

document.addEventListener("DOMContentLoaded", start)
function start()
{
	console.log(window.innerWidth, window.innerHeight)
	init()
	update()
}

function init()
{
	// 1366 x 768
	var ratio = window.innerWidth / window.innerHeight
	camera = new THREE.PerspectiveCamera(60, ratio, 1000, 1000000)
	camera.position.y = 500000
	camera.position.z = 550000
	camera.lookAt({x:0, y:0, z:0})
	scene = new THREE.Scene()
	renderer = new THREE.WebGLRenderer({antialias: false})
	renderer.setPixelRatio(window.devicePixelRatio*2)
	renderer.setSize(window.innerWidth, window.innerHeight, false)
	document.body.appendChild(renderer.domElement)

	document.addEventListener('mousemove', onMouseMove, false)
	window.addEventListener('resize', onResize, false)

	var pine_txt = new THREE.TextureLoader().load("assets/pine1.png")
	var pine_mat = new THREE.MeshBasicMaterial({
		name: "treebase_color", map: pine_txt
	})
	var loader = new THREE.OBJLoader()
	loader.setMaterials({create: function() { return pine_mat }})
	loader.load("assets/pine1.obj", function(pine) {
		var circle_geo = new THREE.CircleGeometry(350000, 16)
		circle_geo.rotateX(Math.TAU * .75)
		var circle_mat = new THREE.MeshBasicMaterial({color: 0x00ff00})
		var circle = new THREE.Mesh(circle_geo, circle_mat)
		scene.add(circle)
		console.log(circle.geometry)
		for (i=1; i<circle.geometry.vertices.length-1; ++i) {
			console.log(circle.geometry.vertices[i])
			p = pine.clone()
			p.rotation.y = Math.TAU * Math.random()
			p.position.add(circle.geometry.vertices[i])
			scene.add(p)
		}
	})
	var car_txt = new THREE.TextureLoader().load("assets/car_yellow.png")
	car_txt.magFilter = THREE.NearestFilter
	var car_mat = new THREE.MeshBasicMaterial({
		name: "car_base_color", map: car_txt
	})
	var loader = new THREE.OBJLoader()
	loader.setMaterials({create: function() { return car_mat }})
	loader.load("assets/car_yellow.obj", function(car) {
		objs.car = car
		car.scale.x = 3
		car.scale.y = 3
		car.scale.z = 3
		scene.add(car)
	})
}

function update()
{
	requestAnimationFrame(update)
	if (objs.car)
		objs.car.rotation.y -= 0.01
	renderer.render(scene, camera)
}

function onMouseMove(event)
{
	mouseX = (event.clientX - windowHalfX) / 2
	mouseY = (event.clientY - windowHalfY) / 2
}

function onResize()
{
	console.log(window.innerWidth, window.innerHeight)
	windowHalfX = window.innerWidth / 2
	windowHalfY = window.innerHeight / 2
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

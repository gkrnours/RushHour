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
	camera = new THREE.PerspectiveCamera(60, ratio, 1000, 2000000)
	camera.position.y = 500000
	camera.position.z = 750000
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
		var circle_geo = new THREE.CircleGeometry(600000, 32)
		circle_geo.rotateX(Math.TAU * .75)
		var circle_mat = new THREE.MeshBasicMaterial({color: 0x00ff00})
		var circle = new THREE.Mesh(circle_geo, circle_mat)
		scene.add(circle)
		var circle_geo = new THREE.CircleGeometry(550000, 32)
		circle_geo.rotateX(Math.TAU * .75)
		circle_geo.rotateY(Math.TAU * Math.random())
		for (i=1; i<circle_geo.vertices.length-1; ++i) {
			p = pine.clone()
			p.rotation.y = Math.TAU * Math.random()
			p.position.add(circle_geo.vertices[i])
			scene.add(p)
		}
		var circle_geo = new THREE.CircleGeometry(500000, 20)
		circle_geo.rotateX(Math.TAU * .75)
		circle_geo.rotateY(Math.TAU * Math.random())
		for (i=1; i<circle_geo.vertices.length-1; ++i) {
			p = pine.clone()
			p.rotation.y = Math.TAU * Math.random()
			p.position.add(circle_geo.vertices[i])
			scene.add(p)
		}
		var circle_geo = new THREE.CircleGeometry(450000, 28)
		circle_geo.rotateX(Math.TAU * .75)
		circle_geo.rotateY(Math.TAU * Math.random())
		for (i=1; i<circle_geo.vertices.length-1; ++i) {
			p = pine.clone()
			p.rotation.y = Math.TAU * Math.random()
			p.position.add(circle_geo.vertices[i])
			scene.add(p)
		}
	})
	var wood_mat = new THREE.MeshBasicMaterial({color: 0x773027})
	var velvet_mat = new THREE.MeshBasicMaterial({color: 0x185F0C})
	var loader = new THREE.OBJLoader()
	loader.setMaterials({create: function(txt) {  switch(txt) {
		case "wood":	return wood_mat
		case "velvet":	return velvet_mat
	}}})
	loader.load("assets/grid.obj", function(grid) {
		box = new THREE.Box3().setFromObject(grid)
		base = box.size()
		grid.scale.x = 50000
		grid.scale.y = 50000
		grid.scale.z = 50000
		scene.add(grid)
	})
	loadCar("car_yellow", function(car) {
		objs.car = car
		car.position.y = 21000
		car.position.z = -30000
		scene.add(car)
	})
}

function update()
{
	requestAnimationFrame(update)
	scene.rotation.y -= 0.005
	renderer.render(scene, camera)
}

function onMouseMove(event)
{
	mouseX = (event.clientX - windowHalfX) / 2
	mouseY = (event.clientY - windowHalfY) / 2
}

function onResize()
{
	windowHalfX = window.innerWidth / 2
	windowHalfY = window.innerHeight / 2
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}

function loadCar(car, fn)
{
	var car_txt = new THREE.TextureLoader().load("assets/"+car+".png")
	car_txt.magFilter = THREE.NearestFilter
	var car_mat = new THREE.MeshBasicMaterial({
		name: "car_base_color", map: car_txt
	})
	var loader = new THREE.OBJLoader()
	loader.setMaterials({create: function() { return car_mat }})
	loader.load("assets/"+car+".obj", function(car) {
		box = new THREE.Box3().setFromObject(car)
		base = box.size()
		car.scale.x = 100000 / base.x
		car.scale.y = 50000 / base.y
		car.scale.z = 50000 / base.z
		fn(car)
	})
}

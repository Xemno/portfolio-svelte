import * as THREE from 'three';

import shaderVert from '$lib/graphics/shaders/ImageBlendEffect/blendVert.glsl';
import shaderFrag from '$lib/graphics/shaders/ImageBlendEffect/blendFrag.glsl';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

const MOUSE_WHEEL_EVENT = 'wheel';
const TOUCH_MOVE = 'touchmove';
const TOUCH_END = 'touchend';
const MOUSE_DOWN = 'mousedown';
const MOUSE_UP = 'mouseup';
const MOUSE_MOVE = 'mousemove';

const scrollPerImage = 500;
const KEYBOARD_ACCELERATION = 25;

const folder = 'Ragnar';
const root = `https://mwmwmw.github.io/files/${folder}`;
const files = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ext = 'jpg';
const IMAGE_SIZE = 512;

class ScrollPos {
	public acceleration: number;
	private maxAcceleration: number;
	private maxSpeed: number;
	public velocity: number;
	private dampen: number;
	private speed: number;
	private touchSpeed: number;
	public scrollPos: number;
	private velocityThreshold: number;
	private snapToTarget: boolean;
	private mouseDown: boolean;
	private lastDelta: number;

	constructor() {
		this.acceleration = 0;
		this.maxAcceleration = 5;
		this.maxSpeed = 20;
		this.velocity = 0;
		this.dampen = 0.97;
		this.speed = 8;
		this.touchSpeed = 8;
		this.scrollPos = 0;
		this.velocityThreshold = 1;
		this.snapToTarget = false;
		this.mouseDown = false;
		this.lastDelta = 0;

		document.addEventListener(
			'touchstart',
			function (event) {
				// event.preventDefault();
			},
			{ passive: false }
		);

		window.addEventListener(MOUSE_WHEEL_EVENT, (event) => {
			// event.preventDefault();
			this.accelerate(Math.sign(event.deltaY) * this.speed);
		});

		window.addEventListener(TOUCH_MOVE, (event) => {
			//event.preventDefault();
			let delta = this.lastDelta - event.targetTouches[0].clientY;
			this.accelerate(Math.sign(delta) * this.touchSpeed);
			this.lastDelta = event.targetTouches[0].clientY;
		});

		window.addEventListener(TOUCH_END, (event) => {
			this.lastDelta = 0;
		});

		window.addEventListener(MOUSE_DOWN, (event) => {
			this.mouseDown = true;
		});

		window.addEventListener(MOUSE_MOVE, (event) => {
			if (this.mouseDown) {
				let delta = this.lastDelta - event.clientY;
				this.accelerate(Math.sign(delta) * this.touchSpeed * 0.4);
				this.lastDelta = event.clientY;
			}
		});

		window.addEventListener(MOUSE_UP, (event) => {
			this.lastDelta = 0;
			this.mouseDown = false;
		});
	}

	private accelerate(amount: number) {
		if (this.acceleration < this.maxAcceleration) {
			this.acceleration += amount;
		}
	}
	public update() {
		this.velocity += this.acceleration;
		if (Math.abs(this.velocity) > this.velocityThreshold) {
			this.velocity *= this.dampen;
			this.scrollPos += this.velocity;
		} else {
			this.velocity = 0;
		}
		if (Math.abs(this.velocity) > this.maxSpeed) {
			this.velocity = Math.sign(this.velocity) * this.maxSpeed;
		}
		this.acceleration = 0;
	}
	public snap(snapTarget: number, dampenThreshold = 100, velocityThresholdOffset = 1.5) {
		if (Math.abs(snapTarget - this.scrollPos) < dampenThreshold) {
			this.velocity *= this.dampen;
		}
		if (Math.abs(this.velocity) < this.velocityThreshold + velocityThresholdOffset) {
			this.scrollPos += (snapTarget - this.scrollPos) * 0.1;
		}
	}
	private project(steps = 1) {
		if (steps === 1) return this.scrollPos + this.velocity * this.dampen;
		var scrollPos = this.scrollPos;
		var velocity = this.velocity;

		for (var i = 0; i < steps; i++) {
			velocity *= this.dampen;
			scrollPos += velocity;
		}
		return scrollPos;
	}

	// public getAcceleration() {
	// 	return this.acceleration;
	// }

	// public setAcceleration(acceleration : number) {
	// 	this.acceleration = acceleration;
	// }
}

export default class TestScene {
	private camera: THREE.PerspectiveCamera;
	private scene: THREE.Scene;
	private renderer: THREE.WebGLRenderer;
	private clock: THREE.Clock;

	private mesh!: THREE.Mesh;
	private geometry!: THREE.PlaneGeometry;
	// private material!: THREE.ShaderMaterial;
	private material!: THREE.ShaderMaterial;

	private mouseWheel: ScrollPos;

	private animFrameId: number = -1;

	private ready: boolean = false;

	private textures: any;

	private ctx: CanvasRenderingContext2D | null;

	constructor(canvas: HTMLCanvasElement) {
		console.log('Constructor called.');

		// var myCanvas = document.getElementById("myCanvas");
		canvas.width = IMAGE_SIZE;
		canvas.height = IMAGE_SIZE;

		console.log('canvas: ', canvas);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			2000
		);
		this.camera.position.set(0, 0, 10);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });

		this.ctx = canvas.getContext('2d');

		// console.log("this.ctx:", this.ctx)

		this.clock = new THREE.Clock();
		this.mouseWheel = new ScrollPos();

		this.scene.add(this.camera);

		this.init();
	}

	private init(): void {
		console.log('init() called.');

		this.loadImages().then((images) => {
			document.getElementById('loading')?.setAttribute('style', 'display: none;');
			console.log("'loading' attribute set for each image.");

			this.initWithImageTextures(images);
			this.ready = true;
		});

		this.addMouseInputSupport();
	}

	private initWithImageTextures(textures: any) {
		console.log('initWithImageTextures() called.');
		console.log('textures:', textures);

		this.textures = textures;

		this.geometry = new THREE.PlaneGeometry(4.75, 7, 4, 4);

		this.material = new THREE.ShaderMaterial({
			// NOTE: uniforms to pass on to shader
			uniforms: {
				time: { value: 1.0 },
				blend: { value: 0.0 },
				tex1: { type: 't', value: textures[1] },
				tex2: { type: 't', value: textures[0] }
			},
			vertexShader: shaderVert,
			fragmentShader: shaderFrag
		});

		// plane mesh
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.scene.add(this.mesh);

		this.resize();
	}

	public start(): void {
		this.update();
	}

	public stop(): void {
		cancelAnimationFrame(this.animFrameId);
	}

	private update(): void {
		this.animFrameId = requestAnimationFrame(this.update.bind(this));

		if (!this.ready) return;

		const delta = this.clock.getDelta();
		const time = this.clock.getElapsedTime() * 10;

		this.mouseWheel.update();
		let scrollTarget =
			Math.floor((this.mouseWheel.scrollPos + scrollPerImage * 0.5) / scrollPerImage) *
			scrollPerImage;
		this.mouseWheel.snap(scrollTarget);

		let { scrollPos, velocity } = this.mouseWheel;

		if (scrollPos < 0) {
			scrollPos = 0;
		}
		if (scrollPos > scrollPerImage * this.textures.length - 1) {
			scrollPos = scrollPerImage * this.textures.length - 1;
		}

		if (scrollPos > 0 && scrollPos < scrollPerImage * this.textures.length - 1) {
			this.updateTexture(scrollPos);
			this.material.uniforms.blend.value = (scrollPos % scrollPerImage) / scrollPerImage;
		}

		this.mouseWheel.scrollPos = scrollPos;

		// this.material.uniforms.time.value += 0.1;

		this.render();
	}

	private render(): void {
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
	}

	private addMouseInputSupport() {
		window.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
				case 33:
				case 38:
					// UP
					this.mouseWheel.acceleration -= KEYBOARD_ACCELERATION;
					this.mouseWheel.update();
					break;
				case 34:
				case 40:
					// DOWN
					this.mouseWheel.acceleration += KEYBOARD_ACCELERATION;
					this.mouseWheel.update();
					break;
			}
		});
	}

	private loadImages() {
		let promises = [];
		for (var i = 0; i < files.length; i++) {
			promises.push(
				new Promise((resolve, reject) => {
					let img = document.createElement('img');
					img.crossOrigin = 'anonymous';
					img.src = `${root}/${files[i]}.${ext}`;
					console.log(img.src);
					img.onload = (image) => {
						return resolve(image.target);
					};
				})
					// .then(this.resizeImage)
					.then(this.makeThreeTexture)
			);
		}
		return Promise.all(promises);
	}

	private resizeImage(image: any, size = IMAGE_SIZE) {
		let newImage = image;
		let { width, height } = image;
		let newWidth = size / width;
		let newHeight = size / height;

		if (this.ctx == null) {
			console.log('this.ctx is null in resizeImage().');
			return;
		}

		this.ctx.drawImage(image, 0, 0, width, height, 0, 0, size, size);
		return this.ctx.getImageData(0, 0, size, size);
	}

	private makeThreeTexture(image: any) {
		let tex = new THREE.Texture(image);
		tex.needsUpdate = true;
		return tex;
	}

	private updateTexture(pos: number) {
		var tex1 = this.textures[1];
		var tex2 = this.textures[0];

		if (tex2 != this.textures[Math.floor(pos / scrollPerImage)]) {
			tex2 = this.textures[Math.floor(pos / scrollPerImage)];
			this.material.uniforms.tex2.value = tex2;
		}
		if (tex1 != this.textures[Math.floor(pos / scrollPerImage) + 1]) {
			tex1 = this.textures[Math.floor(pos / scrollPerImage) + 1];
			this.material.uniforms.tex1.value = tex1;
		}
	}

	private resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

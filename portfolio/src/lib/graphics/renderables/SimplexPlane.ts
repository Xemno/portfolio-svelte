import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
import type IRenderable from './IRenderable';
import { NAMED_COLORS, type Color } from '$lib/utils/colors';

import shaderVert from '$lib/graphics/shaders/test01/vertex2.glsl';
import shaderFrag from '$lib/graphics/shaders/test01/frag.glsl';

let conf = {
	xyCoef: 50,
	zCoef: 10
};

export class SimplexPlane implements IRenderable {
	private plane: THREE.Mesh;
	private simplexNoise: SimplexNoise;
	private geometry: THREE.PlaneGeometry;
	private material: THREE.MeshLambertMaterial;

	private resolution: THREE.Vector2;

	private material2 = new THREE.MeshStandardMaterial({
		color: 0x000000,
		alphaHash: true,
		opacity: 0.7
	});

	// private shaderMaterial : THREE.ShaderMaterial;
	// private uniforms = {
	// 	time: { value: 1.0 }
	// };

	// private shaderMaterial! : THREE.ShaderMaterial;
	// private uniforms = {
	// 	u_time: { type: "f", value: 1.0 },
	// 	u_resolution: { type: "v2", value: new THREE.Vector2() },
	// };

	// TODO: apply builder pattern ? but with static builder 

	private elapsedTime: number = 0;

	constructor(
		width?: number,
		height?: number,
		widthSegments?: number,
		heightSegments?: number,
		resolution?: THREE.Vector2
	) {
		this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
		this.simplexNoise = new SimplexNoise();
		this.material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });

		this.resolution = new THREE.Vector2(resolution?.x, resolution?.y);

		// console.log('SimplexPlane constructor.');
		

		// this.shaderMaterial = new THREE.ShaderMaterial({
		// 	uniforms: this.uniforms,
		// 	vertexShader: shaderVert,
		// 	fragmentShader: shaderFrag,
		// });
		// this.shaderMaterial = new THREE.ShaderMaterial({
		// 	uniforms: this.uniforms,
		// 	vertexShader: shaderVert,
		// 	fragmentShader: shaderFrag
		// 	// transparent: true,
		// 	// visible: true,
		// 	// side: THREE.DoubleSide,
		// 	// depthWrite: false
		// });

		// this.material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: true }); // NOTE: enable wireframe
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.plane.rotation.x = -Math.PI / 2 - 0.15;
		this.plane.position.y = -25;
		// this.plane.position.z = - 100;
	}

	public update(deltaTime: number, mouseScreenPos: THREE.Vector2) {
		let pArray = this.plane.geometry.attributes.position.array;

		let deltaVelocity = mouseScreenPos.x + mouseScreenPos.y;
		// console.log('deltaVelocity: ', pArray);
		// console.log('deltaTime: ', deltaTime);

		this.elapsedTime = this.elapsedTime + deltaTime * 0.2;

		for (let i = 0; i < pArray.length; i += 3) {
			// for each vertice
			const x = pArray[i] / conf.xyCoef;
			const y = pArray[i + 1] / conf.xyCoef;
			pArray[i + 2] = this.simplexNoise.noise4d(x, y, this.elapsedTime, deltaVelocity) * conf.zCoef;
		}

		// indicate this attribute has changed and should be re-sent to the GPU
		this.plane.geometry.attributes.position.needsUpdate = true;
		// compute normals so shading works properly
		this.plane.geometry.computeVertexNormals();

		// if needed:
		// this.plane.geometry.computeBoundingBox();
		// this.plane.geometry.computeBoundingSphere();

		// this.uniforms[ 'u_time' ].value = performance.now() / 1000;
		// this.uniforms[ 'u_resolution' ].value = this.resolution;
	}

	public onThemeChange(val: boolean) {
		// TODO: rename to onThemeChange
		// console.log('themeCallback: ' + val);
		if (val) {
			// dark mode
			this.material.emissive.set(new THREE.Color(NAMED_COLORS.black));
		} else {
			// white mode
			this.material.emissive.set(new THREE.Color(NAMED_COLORS.papayawhip));
		}
	}

	onWindowResize(width: number, height: number, isPortraitMode: boolean): void {

	}

	public setEmissive(color: Color) {
		this.material.emissive = new THREE.Color(color);
	}

	public setPosition(pos: THREE.Vector3) {
		this.plane.position.set(pos.x, pos.y, pos.z);
	}

	public setRotation() {}

	public getPlane(): THREE.Mesh {
		return this.plane;
	}
}

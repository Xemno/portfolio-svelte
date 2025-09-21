import type IRenderable from './IRenderable';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import { NAMED_COLORS, type Color } from '$lib/utils/colors';

let conf = {
	xyCoef: 50,
	zCoef: 10
};

export class SimplexPlane implements IRenderable {
	private plane: THREE.Mesh;
	private simplexNoise = new SimplexNoise();
	private geometry: THREE.PlaneGeometry;
	private material: THREE.MeshLambertMaterial;

	private resolution: THREE.Vector2;

	private elapsedTime: number = 0;

	constructor(
		width?: number,
		height?: number,
		widthSegments?: number,
		heightSegments?: number,
		resolution?: THREE.Vector2
	) {
		this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
		this.material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		this.resolution = new THREE.Vector2(resolution?.x, resolution?.y);
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.plane.rotation.x = -Math.PI / 2 - 0.15;
		this.plane.position.y = -25;
		this.geometry.dispose();
	}

	public update(deltaTime: number, mouseScreenPos: THREE.Vector2) {
		let pArray = this.plane.geometry.attributes.position.array;
		let deltaVelocity = (mouseScreenPos.x + mouseScreenPos.y) / 10.0;

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
	}

	public onThemeChange(val: boolean) {
		if (val) {
			// dark mode
			this.material.emissive.set(new THREE.Color(NAMED_COLORS.black));
		} else {
			// white mode
			this.material.emissive.set(new THREE.Color(NAMED_COLORS.papayawhip));
		}
	}

	public onWindowResize(width: number, height: number, isPortraitMode: boolean): void {
		this.geometry = new THREE.PlaneGeometry(width * 2, height * 2, width / 2, height / 2); // TODO: not corect since width and height not matching initial width height

		// this.plane.clear();
		this.plane.geometry = this.geometry;
	}

	public setEmissive(color: Color) {
		this.material.emissive = new THREE.Color(color);
	}

	public setPosition(pos: THREE.Vector3) {
		this.plane.position.set(pos.x, pos.y, pos.z);
	}

	public setRotation() {}

	public getMesh(): THREE.Mesh {
		return this.plane;
	}
}

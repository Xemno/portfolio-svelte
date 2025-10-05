import type IRenderable from './IRenderable';
import type { NavItem } from '$lib/types';

import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { toWorldPosition } from '../utils/VectorUtils';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { TextParticleSystem } from './TextParticleSystem';
import { TweenMorphing } from './TweenMorphing';

interface Item {
	idx: number;
	geometry: TextGeometry;
	particles: THREE.BufferGeometry;
	points: Array<THREE.Vector3>;
}
type GeometryItems = Array<Item>;

// Options
const particleCount = 5000;
const typefaceRegular = 'fonts/optimer_bold.typeface.json';
const typefaceMobile = 'fonts/helvetiker_bold.typeface.json';

export default class TextCloud implements IRenderable {
	private lookAt?: THREE.Vector3;

	private fontLoader = new FontLoader();
	private font!: Font;
	private ready: boolean = false;

	private isMobile: boolean = false;
	private isPortraitMode: boolean = false;

	private particleSystem: TextParticleSystem;
	private tweenMorphing: TweenMorphing;

	private renderer: THREE.WebGLRenderer;
	private camera: THREE.PerspectiveCamera;

	constructor(
		renderer: THREE.WebGLRenderer,
		camera: THREE.PerspectiveCamera,
		scene: THREE.Scene,
		navItems: Array<NavItem>,
		// initParams: NavItem,
		isMobile: boolean,
		isPortrait: boolean,
		resolution?: THREE.Vector2,
		pos?: THREE.Vector3,
		lookAt?: THREE.Vector3
	) {
		let initParams: NavItem = navItems.at(0)!;

		this.renderer = renderer;
		this.camera = camera;
		this.isMobile = isMobile;

		this.particleSystem = new TextParticleSystem();
		this.particleSystem.setNumParticles(particleCount);
		this.tweenMorphing = new TweenMorphing(this.particleSystem);

		console.log('font path: ' + this.isMobile ? typefaceMobile : typefaceRegular);

		// load font and execute onLoad callback
		this.fontLoader.load(this.isMobile ? typefaceMobile : typefaceRegular, (font) => {
			this.particleSystem.createParticles(font, navItems);
			this.particleSystem.createCurrParticles(font, initParams);
			let vWorldPos = this.getMainTitleTextPosition();
			if (vWorldPos != null) {
				this.particleSystem.setCurrParticlesPos(vWorldPos);
			}

			scene.add(this.particleSystem.getParticleSystem());

			// play initial animation
			this.startEntryAnimation(initParams);
			this.onWindowResize(0, 0, isPortrait);

			this.font = font;
			this.ready = true;
		});
	}

	public getMesh(): THREE.Mesh {
		return this.particleSystem.getParticleSystem();
	}

	public cleanup(): void { }

	public update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void {
		if (this.lookAt != null) {
			this.particleSystem.getParticleSystem().lookAt(this.lookAt);
		}

		this.tweenMorphing.update();
	}

	public onNavigationChange(item: NavItem) {
		if (!this.ready) return;

		// let it = { slug: base + item.slug, name: item.name, idx: item.idx };
		this.tweenMorphing.morphTo(item);
	}

	public onThemeChange(val: boolean) {
		this.particleSystem.onThemeChange(val);
	}

	public onWindowResize(width: number, height: number, isPortraitMode: boolean) {
		this.onOrientationChange(isPortraitMode);
	}

	public onAfterUiUpdate() {
		if (!this.ready) return;
		let vWorldPos = this.getMainTitleTextPosition();

		this.particleSystem.setCurrParticlesPos(vWorldPos);
	}

	public onMouseMove(event: MouseEvent) { }

	public onTouchMove(event: TouchEvent) { }

	private onOrientationChange(isPortraitMode: boolean) {
		if (this.isPortraitMode != isPortraitMode) {
			this.isPortraitMode = isPortraitMode;

			if (!this.ready) return;
			let vWorldPos = this.getMainTitleTextPosition();
			this.particleSystem.setCurrParticlesPos(vWorldPos);
		}
	}

	private getMainTitleTextPosition(): THREE.Vector3 | null {
		let mainTitleText: HTMLElement | null = document.getElementById('main-title');

		if (mainTitleText != null) {
			let { top, bottom, left, right } = mainTitleText.getBoundingClientRect();
			const midX = left + (right - left) / 2;
			const midY = top + (bottom - top) / 2;
			const midPoint = new THREE.Vector2(midX, midY);
			return toWorldPosition(midPoint, this.camera, this.renderer);
		}
		return null;
	}

	private startEntryAnimation(navItem: NavItem) {
		// if Home nav
		const sphereGeom = new THREE.SphereGeometry(16, 16, 16);
		const sphere = new THREE.Mesh(sphereGeom);
		const sphereSampler = new MeshSurfaceSampler(sphere).setWeightAttribute('color').build();

		let sphereParticlesPos: Array<THREE.Vector3> = new Array<THREE.Vector3>();
		for (let i = 0; i < particleCount; ++i) {
			const position = new THREE.Vector3();
			sphereSampler.sample(position);
			sphereParticlesPos.push(position);
		}

		// cleanup
		sphereGeom.dispose();
		sphere.clear();

		const toPositionVectors = this.particleSystem.getParticlesAtPos(navItem.idx);

		this.tweenMorphing.morphFromToCubic(
			sphereParticlesPos,
			toPositionVectors!,
			2000,
			0
		);
	}
}

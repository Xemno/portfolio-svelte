export default interface IRenderable {
	update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void;
	onThemeChange(val: boolean): void;
	onWindowResize(width: number, height: number, isPortraitMode: boolean): void;
	getMesh(): THREE.Mesh;
	// cleanup / onDestroy
}

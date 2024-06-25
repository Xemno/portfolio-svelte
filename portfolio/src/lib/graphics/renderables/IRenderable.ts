export default interface IRenderable {
	update(deltaTime: number, mouseScreenPos: THREE.Vector2 | void): void;
	// TODO: onNavigationChange
}
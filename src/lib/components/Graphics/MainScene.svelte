<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { onHydrated, theme } from '$lib/stores/theme';
	import { page } from '$app/stores';
	import { getAllNamedRoutes, routeToName } from '$lib/utils/helpers';
	import { detectMobile } from '$lib/stores/navigation';
	import MainScene from '$lib/graphics/scenes/mainScene';

	let canvas: HTMLCanvasElement;
	let scene: MainScene;

	onMount(() => onHydrated());

	onMount(() => {
		const isMobile = detectMobile();
		const allNamedRoutes = getAllNamedRoutes();

		scene = new MainScene(canvas, allNamedRoutes, isMobile);
		theme.subscribe((v) => scene.onThemeChange(v));
		page.subscribe((v) => scene.onNavigationChange(routeToName(allNamedRoutes, v.url.pathname)));
		scene.start();

		var containerNode = document.querySelectorAll('div')[0];
		
		const observer = new MutationObserver(() => {
			scene.onAfterUiUpdate();
		});
		observer.observe(containerNode, { subtree: true, characterData: true, childList: true });

		return () => {
			scene.stop();
			observer.disconnect();
		};
	});

	onDestroy(() => {});
</script>

<canvas id="canvas" bind:this={canvas}></canvas>

<style lang="scss">
	canvas {
		width: 100vw;
		height: 100vh;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -9999;
	}
</style>

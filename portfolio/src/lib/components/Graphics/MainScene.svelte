<script lang="ts">
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
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
		console.log('MainScene - isMobile: ', isMobile);

		const allNamedRoutes = getAllNamedRoutes();
		// const initNamedRoute = routeToName(allNamedRoutes, $page.url.pathname);

		// allNamedRoutes.forEach((item) => console.log('it: : ', item));

		scene = new MainScene(canvas, allNamedRoutes, isMobile);
		theme.subscribe((v) => scene.onThemeChange(v));
		page.subscribe((v) => scene.onNavigationChange(routeToName(allNamedRoutes, v.url.pathname)));
		scene.start();
		console.log('MainScene - start.');

		return () => {
			scene.stop();
			// scene.cleanup();
			console.log('MainScene - stopped.');
		};
	});

	beforeUpdate(() => {
		console.log('the component is about to update');
	});

	// TODO: not working ....
	afterUpdate(() => {
		console.log('MainScene - afterUpdate.');

		if (scene != null) {
			scene.onAfterUiUpdate();
		}
	});

	onDestroy(() => {
		console.log('MainScene - destroyed.');
	});
</script>

<!-- <canvas id="canvas" class="fixed left-0 top-0 -z-50" bind:this={canvas} /> -->
<canvas id="canvas" bind:this={canvas} />

<style lang="scss">
	canvas {
		width: 100vw;
		height: 100vh;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -9999; // NOTE: comment to make input controls accessible, uncomment to bring canvas behind
	}
</style>

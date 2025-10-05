<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { onHydrated, theme } from '$lib/stores/theme';
	// import { page } from '$app/stores';
	import { page, navigating } from '$app/state';
	import { getAllNamedRoutes, routeToName } from '$lib/utils/helpers';
	import { detectMobile } from '$lib/stores/navigation';
	import MainScene from '$lib/graphics/scenes/mainScene';

	let canvas: HTMLCanvasElement;
	let scene: MainScene;

	let mounted = false;
	// let pageParams = $derived(page.params);
	// console.log('0. pageParams: ', pageParams);
	// console.log('1. pageParams: ', pageParams.slug);

	// console.log('navigating: ', navigating);
	// console.log('navigating delta: ', navigating.delta);



	onMount(() => onHydrated());

	onMount(() => {
		mounted = true;
		const isMobile = detectMobile();
		const allNamedRoutes = getAllNamedRoutes();

		scene = new MainScene(canvas, allNamedRoutes, isMobile);
		theme.subscribe((v) => scene.onThemeChange(v));
		// page.subscribe((v) => {
		// 	scene.onNavigationChange(routeToName(allNamedRoutes, v.url.pathname));
		// });

		// $effect(() => {
		// 	scene.onNavigationChange(routeToName(allNamedRoutes, navigating.to?.url.pathname));
		// 	console.log('effect change: ', navigating.to?.url.pathname);
		// });

		// let nav = $derived(navigating.to?.url.pathname);
		// scene.onNavigationChange(routeToName(allNamedRoutes, nav));
		// console.log('effect change: ', nav);

		scene.start();

		var containerNode = document.querySelectorAll('div')[0];

		const observer = new MutationObserver(() => {
			scene.onAfterUiUpdate();
			scene.onNavigationChange(routeToName(allNamedRoutes, navigating.to?.url.pathname!));
			console.log('effect change: ', navigating.to?.url.pathname);
		});
		observer.observe(containerNode, { subtree: true, characterData: false, childList: true });

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

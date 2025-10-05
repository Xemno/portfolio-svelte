<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { onHydrated, theme } from '$lib/stores/theme';
	import { afterNavigate } from '$app/navigation';
	import { getAllNamedRoutes, routeToName } from '$lib/utils/helpers';
	import { detectMobile } from '$lib/stores/navigation';
	import MainScene from '$lib/graphics/scenes/mainScene';

	let canvas: HTMLCanvasElement;
	let scene: MainScene;

	const isMobile = detectMobile();
	const allNamedRoutes = getAllNamedRoutes();

	if (!isMobile) {
		afterNavigate(({ from, to }) => {
			scene.onAfterUiUpdate();
			scene.onNavigationChange(routeToName(allNamedRoutes, '/portfolio-svelte' + to?.url?.pathname!));
			console.log('from: ' + from?.url?.pathname + ', to: ' + '/portfolio-svelte' + to?.url?.pathname!);
		});
	}

	onMount(() => onHydrated());

	onMount(() => {
		scene = new MainScene(canvas, allNamedRoutes, isMobile);
		theme.subscribe((v) => scene.onThemeChange(v));

		scene.start();

		return () => {
			scene.stop();
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

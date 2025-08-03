<script lang="ts">
	import 'uno.css';
	import '$lib/index.scss';
	import NavMenu from '$lib/components/NavMenu/NavMenu.svelte';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	import MainScene from '$lib/components/Graphics/MainScene.svelte';

	import { onNavigate } from '$app/navigation';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onNavigate(({ complete }) => {
		if (document == undefined) return;
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await complete;
			});
		});
	});

	// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	// import gsap from 'gsap';

	// gsap.registerPlugin(ScrollTrigger);

	// let scrollElem: HTMLElement;

	// onMount(() => {
	// 	const ctx = gsap.context((self) => {
	// 		const showAnim = gsap
	// 			.from('.nav-menu', {
	// 				yPercent: -100,
	// 				paused: true,
	// 				duration: 0.25
	// 			})
	// 			.progress(1);

	// 		ScrollTrigger.create({
	// 			start: 'top top',
	// 			end: 'max',
	// 			onUpdate: (self) => {
	// 				console.log('self.progress: ', self.progress.toFixed(3)); // NOTE: Progress between 0 and 1.0
	// 				console.log('self.direction: ', self.direction); // NOTE: -1 or 1
	// 				console.log('self.velocity: ', self.getVelocity()); // NOTE: -1 or 1

	// 				if (self.direction === -1) {
	// 					showAnim.play();
	// 				} else {
	// 					showAnim.reverse();
	// 				}
	// 			}
	// 		});
	// 	}, scrollElem); // <- Scope!

	// 	// return () => ctx.revert(); // <- Cleanup!

	// 	return {
	// 		destroy: () => {
	// 			ctx.revert();
	// 		}
	// 	};
	// });
</script>

<div class={`body contents ${$theme ? 'theme-dark' : 'theme-light'}`} id="mydiv">
	<NavMenu />
	<MainScene />
	<div class="content container">{@render children?.()}</div>
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0px 0px;
	}

	.body {
		margin: 0px;
		background-color: var(--main);
		color: var(--main-text);
		font-family: var(--text-f);
		display: flex;
		flex-direction: column;
		transition-duration: 200ms;
		letter-spacing: 1px;
		min-height: 100vh;
		background: transparent;
	}

	:global(p) {
		margin: 0px;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		margin: 5px 0px;
	}
</style>

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

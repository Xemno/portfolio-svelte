<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import TestScene from '$lib/components/Graphics/TestScene.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let testSceneComp: TestScene;
</script>

<div class={`body contents ${$theme ? 'theme-dark' : 'theme-light'}`} id="mydiv2">
	<TestScene bind:this={testSceneComp} />
	<div class="content container">{@render children?.()}</div>
</div>

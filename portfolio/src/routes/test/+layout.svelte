<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import TestScene from '$lib/components/Graphics/TestScene.svelte';

	let testSceneComp: TestScene;
</script>

<div class={`body contents ${$theme ? 'theme-dark' : 'theme-light'}`} id="mydiv2">
	<TestScene bind:this={testSceneComp} />
	<div class="content container"><slot /></div>
</div>


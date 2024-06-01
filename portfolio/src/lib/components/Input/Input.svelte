<script lang="ts">
	import UIcon from '../Icon/UIcon.svelte';

	import { onMount } from 'svelte';

	export let value = '';
	export let placeholder = '';
	export let autoFocusSearch = false;

	const searchId = 'searchInput';

	function setFocusToTextInput() {
		var textbox = document.getElementById(searchId);
		if (textbox != null) {
			textbox.focus();
			// textbox.scrollIntoView();
		}
	}

	onMount(() => {
		if (autoFocusSearch) {
			setFocusToTextInput();
		}
	});


</script>

<div class="box">
	<input
		id={searchId}
		bind:value
		{placeholder}
		class="input text-[inherit] text-[1.15em] border-[var(--border)] border-[1px] border-solid bg-transparent"
		onmouseout="this.value = ''; this.blur();"
	/>

	<i class="i-carbon-search" />
	
	
</div>

<style lang="scss">
	.box input {
		padding: 20px;
		width: 55px;
		height: 55px;
		border-radius: 50px;
		box-sizing: border-box;
		transition: 0.5s;
		// border: none;
		// color: transparent;


		&:focus {
			outline: 1px auto var(--border-hover);
			background-color: var(--main-hover);
		}
	}

	.box {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.box:hover input {
		width: 100%;
		height: 55px;
		border: solid;
		// border-radius: 10px;
	}
	.input:focus {
		width: 100%;
		height: 55px;
		border: solid;
		// border-radius: 10px;
	}


	.box i {
		position: absolute;
		width: 30px;
		height: 30px;
		// top: 50%;
		// right: 15px;
		transform: translate(-120%, 35%);
		// font-size: 40px;
		color: var(--border);
		border: solid;
		transition: 0.2s;
	}
	.box:hover i {
		opacity: 0;
		z-index: -1;
	}
</style>

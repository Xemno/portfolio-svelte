<script lang="ts">
	import UIcon from '../Icon/UIcon.svelte';

	import { onMount } from 'svelte';

	export let value = '';
	export let placeholder = '';
	export let autoFocusSearch = false;

	const searchId = 'searchInput';

	let tmpSearchValue = '';
	let isActive = false;

	$: {
		if (!isActive) {
			value = tmpSearchValue;
		}
	}

	function setFocusToTextInput() {
		var textbox = document.getElementById(searchId);
		if (textbox != null) {
			textbox.focus();
			// textbox.scrollIntoView();
		}
	}

	function setListeners() {
		var textInput = document.getElementById(searchId);
		if (textInput != null) {
			textInput.addEventListener('focusin', function () {
				textInput!.placeholder = placeholder;

				isActive = false;
				if (value != '') {
					tmpSearchValue = value;
				}
			});

			textInput.addEventListener('focusout', function () {
				textInput!.placeholder = '';

				value = tmpSearchValue;
				isActive = true;
				tmpSearchValue = '';
			});
		}
	}

	onMount(() => {
		if (autoFocusSearch) {
			setFocusToTextInput();
		}

		setListeners();
	});
</script>

<div class="box">
	<input
		id={searchId}
		bind:value={tmpSearchValue}
		maxlength="100"
		class="input text-[inherit] text-[1.15em] border-[var(--border)] border-[0px] border-solid bg-[var(--btn-search)]"
	/>

	<i class="i-carbon-search" />
</div>

<style lang="scss">
	.box input {
		padding: 20px;
		width: 45px;
		height: 45px;
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
		height: 45px;
		border: solid;
		// border-radius: 10px;
	}
	.input:focus {
		width: 100%;
		height: 45px;
		border: solid;
		// border-radius: 10px;
	}

	.box i {
		position: absolute;
		width: 25px;
		height: 25px;
		top: 50%;
		transform: translate(-120%, -50%);
		font-size: 40px;
		color: var(--search-icon);
		border: solid;
		transition: 0.2s;
	}
	.box:hover i {
		opacity: 0;
		z-index: -1;
	}
</style>

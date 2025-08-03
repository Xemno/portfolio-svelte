<script lang="ts">
	// TODO: rename to SearchInput

	import { onMount } from 'svelte';

	interface Props {
		value?: string;
		placeholder?: string;
		autoFocusSearch?: boolean;
	}

	let { value = $bindable(''), placeholder = '', autoFocusSearch = false }: Props = $props();

	const searchId = 'searchInput';

	let tmpSearchValue = $state('');
	let isActive = $state(false);
	let className = $derived(tmpSearchValue == '' ? 'input ' : `keepopen `);

	$effect(() => {
		if (!isActive) {
			value = tmpSearchValue;
		}
	});

	function setFocusToTextInput() {
		var textbox = document.getElementById(searchId);
		if (textbox != null) {
			textbox.focus();
			// textbox.scrollIntoView();
		}
	}

	function setListeners() {
		var textInput: HTMLInputElement = <HTMLInputElement>document.getElementById(searchId)!;
		if (textInput != null) {
			textInput.addEventListener('focusin', function () {
				textInput.placeholder = placeholder;

				isActive = false;
				if (value != '') {
					tmpSearchValue = value;
				}
			});

			textInput.addEventListener('focusout', function () {
				textInput.placeholder = '';

				value = tmpSearchValue;
				isActive = true;
				// tmpSearchValue = '';
			});
		}
	}

	onMount(() => {
		if (autoFocusSearch) {
			setFocusToTextInput();
		}

		setListeners();
	});

	const resetInput = () => {
		value = tmpSearchValue = '';
	};
</script>

<div class="box">
	<input
		id={searchId}
		bind:value={tmpSearchValue}
		maxlength="100"
		class={className +
			`text-[inherit] text-[1.15em] border-[var(--border)] border-[0px] border-solid bg-[var(--btn-search)]`}
	/>

	{#if value == ''}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="i-carbon-search" onclick={setFocusToTextInput}></button>
	{:else}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="i-carbon-close" onclick={resetInput}></button>
	{/if}
</div>

<style lang="scss">
	.box input {
		padding: 20px;
		width: 43px;
		height: 45px;
		border-radius: 50px;
		box-sizing: border-box;
		transition: 0.5s;

		&:hover {
			width: 100%;
			height: 45px;
			border: 1px solid;
		}

		&:focus {
			width: 100%;
			height: 45px;
			border: 1px solid;
			// border-radius: 10px;
			outline: transparent;
		}
	}

	.box {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.box .keepopen {
		width: 100%;
		height: 45px;
		border: 1px solid;
		transition: 0s;
		outline: transparent;
	}

	.box button {
		position: absolute;
		width: 25px;
		height: 25px;
		top: 50%;
		transform: translate(-120%, -50%);
		font-size: 40px;
		color: var(--search-icon);
		border: 1px solid;
		transition: 0.2s;

		&:hover {
			color: var(--accent-hover);
		}
	}
</style>

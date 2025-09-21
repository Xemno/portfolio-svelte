<script lang="ts">
	import { resolve } from '$app/paths';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { items } from '@data/navbar';
	import * as HOME from '@data/home';
	import UIcon from '../Icon/UIcon.svelte';

	let expanded = $state(false);

	const toggleExpanded = (v?: boolean) => {
		if (typeof v === 'undefined') {
			expanded = !expanded;
		} else {
			expanded = v;
		}
	};
</script>

<div class="nav-menu">
	<nav class="container row items-center text-sm">
		<a
			href={resolve(`/`)}
			class="nav-menu-left decoration-none w-auto md:w-150px lg:w-auto row row items-center cursor-pointer px-4 text-[var(--secondary-text)] self-stretch hover:bg-[color:var(--main-hover)]"
		>
			<UIcon icon="i-line-md-coffee-loop" classes="text-2em" />
			<span
				class="ml-2 text-md font-bold hidden md:inline overflow-hidden whitespace-nowrap text-ellipsis"
			>
				{HOME.name}
				{HOME.lastName}
			</span>
		</a>

		<div class="flex-1 block overflow-hidden md:hidden whitespace-nowrap text-ellipsis text-center">
			{HOME.name}
			{HOME.lastName}
		</div>
		<div class="flex-row flex-1 self-center h-full justify-center hidden md:flex">
			{#each items as item (item.title)}
				<a href={resolve(`${item.to}`)} class="nav-menu-item !text-[var(--secondary-text)]">
					<UIcon icon={item.icon} classes="text-1.8em" />
					<span class="nav-menu-item-label">{item.title}</span>
				</a>
			{/each}
		</div>

		<div
			class="row h-full justify-center items-stretch m-l-auto md:m-l-0 w-auto md:w-150px gap-1 text-1.15em"
		>
			<div class="row hidden md:flex">
				<a
					href={resolve(`/search`)}
					class="text-inherit col-center self-stretch px-2 hover:bg-[color:var(--main-hover)]"
				>
					<UIcon icon="i-carbon-search" classes="text-1.5em" />
				</a>
				<button
					class="bg-transparent text-1em border-none cursor-pointer hover:bg-[color:var(--main-hover)] text-[var(--secondary-text)] px-2"
					onclick={() => toggleTheme()}
				>
					{#if $theme}
						<UIcon icon="i-line-md-sunny-outline-to-moon-loop-transition" classes="text-1.5em" />
					{:else}
						<UIcon icon="i-line-md-moon-to-sunny-outline-loop-transition" classes="text-1.5em" />
					{/if}
				</button>
			</div>
			<div class="col-center md:hidden h-full hover:bg-[var(--main-hover)] cursor-pointer">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class={`nav-bar-mobile-btn col-center ${expanded ? 'nav-bar-mobile-btn-expanded' : ''}`}
					onkeydown={() => {}}
					onkeyup={() => {}}
					onclick={() => toggleExpanded()}
				></div>
			</div>
		</div>
	</nav>
	<div class={`nav-menu-mobile ${expanded ? 'nav-menu-mobile-open' : ''} md:hidden`}>
		<div class="flex-col flex-1 self-center h-full justify-center m-t-7">
			{#each items as item}
				<a
					href={resolve(`${item.to}`)}
					class="nav-menu-item !text-[var(--secondary-text)] gap-5"
					onclick={() => toggleExpanded(false)}
				>
					<UIcon icon={item.icon} classes="text-1.5em" />
					<span class="">{item.title}</span>
				</a>
			{/each}
		</div>
		<div class="col gap-2 m-t-8">
			<a
				href={resolve(`/search`)}
				class="nav-menu-item !text-[var(--secondary-text)] gap-5"
				onclick={() => toggleExpanded(false)}
			>
				<UIcon icon="i-carbon-search" classes="text-1.5em" />
				<span>Search</span>
			</a>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="nav-menu-item !text-[var(--secondary-text)] gap-5" onclick={() => toggleTheme()}>
				{#if $theme}
					<UIcon icon="i-line-md-sunny-outline-to-moon-loop-transition" classes="text-1.5em" />
					<span>Dark Theme</span>
				{:else}
					<UIcon icon="i-line-md-moon-to-sunny-outline-loop-transition" classes="text-1.5em" />
					<span>Light Theme</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.nav-menu {
		display: flex;
		justify-content: center;
		position: sticky;
		top: 0px;
		z-index: 10;
		padding: 0px 10px;
		height: 50px;
		border-bottom: 1px solid var(--secondary);
		background-color: var(--main);

		&-item {
			text-decoration: none;
			font-weight: 400;
			padding: 10px 20px;
			color: inherit;
			display: flex;
			align-items: center;
			border-bottom: 3px solid transparent;

			&-label {
				margin-left: 10px;

				@media (max-width: 950px) {
					& {
						display: none;
					}
				}
			}
			&:hover {
				background-color: var(--main-hover);
			}
		}
	}

	.nav-menu-mobile {
		z-index: -1;
		max-height: calc(100vh - 50px - 1px);
		min-height: calc(100vh - 50px - 1px);
		width: 100%;
		position: absolute;
		background-color: var(--main);
		top: 51px;
		transform: translateY(-100vh);
		transition-property: transform opacity;
		transition: 300ms ease;
		opacity: 0;
		&-open {
			opacity: 1;
			transform: translateY(0vh);
		}
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { items, title } from '@data/skills';
	import { getAssetURL } from '$lib/data/assets';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import CardDivider from '$lib/components/Card/CardDivider.svelte';
	import SkillCard from '$lib/components/SkillCard/SkillCard.svelte';
	import type { Skill } from '$lib/types';

	let search = $state('');

	let result: Skill[] = $derived(
		items.filter((skill) => {
			const isSearched =
				search.trim().length === 0 ||
				skill.name.trim().toLowerCase().includes(search.trim().toLowerCase());
			return isSearched;
		})
	);

	const onSearch = (query: string) => (search = query);
</script>

<SearchPage {title} {onSearch}>
	{#if result.length === 0}
		<!-- NOTE: if search result is empty -->
		<div class="p-5 m-b-100 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-carbon-help" classes="text-2.5em" />
			<p class="font-300">Could not find anything...</p>
		</div>
	{:else}
		<!-- NOTE: result is either filled completely or filtered with search result -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-5 mt-10">
			{#each result as skill}
				<SkillCard {skill} />
			{/each}
		</div>
	{/if}
</SearchPage>

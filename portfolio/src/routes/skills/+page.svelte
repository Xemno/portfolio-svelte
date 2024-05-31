<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import { base } from '$app/paths';
	import { SKILLS } from '$lib/params';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import type { Skill } from '$lib/types';
	import { isBlank } from '$lib/utils/helpers';
	import { getAssetURL } from '$lib/data/assets';
	import UIcon from '$lib/components/Icon/UIcon.svelte';

	const { items, title } = SKILLS;

	let result: Array<Skill> = items;

	const onSearch = (e: CustomEvent<{ search: string }>) => {
		const query = e.detail.search;

		if (isBlank(query)) {
			result = items;
			return;
		}

		result = items.filter((it) => it.name.toLowerCase().includes(query));
	};
</script>

<SearchPage {title} on:search={onSearch}>
	{#if result.length === 0}
		<!-- NOTE: if search result is empty -->
		<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-line-md-emoji-smile-twotone" classes="text-3.0em" />
			<p class="font-300">I don't have that kind of skill...</p>
		</div>
	{:else}
		<!-- NOTE: result is either filled completely or filtered with search result -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-5 mt-10">
			{#each result as skill (skill.slug)}
				<Card
					classes={['cursor-pointer decoration-none']}
					tiltDegree={5}
					href={`${base}/skills/${skill.slug}`}
					bgImg={getAssetURL(skill.logo)}
					color={skill.color}
				>
					<p class="text-[var(--tertiary-text)]">{skill.name}</p>
				</Card>
			{/each}
		</div>
	{/if}
</SearchPage>

<script lang="ts">
	import EducationCard from '$lib/components/EducationCard/EducationCard.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import { title, items } from '@data/education';
	import type { Education } from '$lib/types';

	let search = $state('');

	let result = $derived(
		items.filter(
			(it) =>
				it.name.toLowerCase().includes(search.toLowerCase()) ||
				it.description.toLowerCase().includes(search) ||
				it.location.toLowerCase().includes(search) ||
				it.degree.toLowerCase().includes(search) ||
				it.organization.toLowerCase().includes(search)
		)
	);

	const onSearch = (query: string) => (search = query);
</script>

<SearchPage {title} {onSearch}>
	<div class="col items-center relative mt-10 flex-1">
		{#if result.length === 0}
			<div class="p-5 mb-100 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
				<UIcon icon="i-carbon-help" classes="text-2.5em" />
				<p class="font-300">Could not find anything...</p>
			</div>
		{:else}
			<div
				class="w-[0.5px] hidden lg:flex top-0 bottom-0 py-50px bg-[var(--border)] absolute rounded"
			></div>

			{#each result as education, index (education.slug)}
				<div
					class={`flex ${
						index % 2 !== 0 ? 'flex-row' : 'flex-row-reverse'
					} relative items-center w-full my-[10px]`}
				>
					<div class="flex-1 hidden lg:flex"></div>
					<div class="hidden lg:inline p-15px bg-transparent">
						<UIcon icon="i-carbon-condition-point" />
					</div>
					<div class="col flex-1 items-stretch">
						<EducationCard {education} />
					</div>
				</div>
			{/each}
		{/if}
	</div>
</SearchPage>

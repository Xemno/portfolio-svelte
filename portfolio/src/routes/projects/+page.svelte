<script lang="ts">
	import type { Skill } from '$lib/types';

	import { items, title } from '@data/projects';
	import * as skills from '@data/skills';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import ProjectCard from '$lib/components/ProjectCard/ProjectCard.svelte';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';

	interface SkillFilter extends Skill {
		isSelected?: boolean;
	}

	let filters: Array<SkillFilter> = $state(
		skills.items.filter((it) => {
			return items.some((project) => project.skills.some((skill) => skill.slug === it.slug));
		})
	);

	let search = $state('');

	const isSelected = (slug: string): boolean => {
		return filters.some((item) => item.slug === slug && item.isSelected);
	};

	const toggleSelected = (slug: string) => {
		filters = filters.map((tech) => {
			if (tech.slug === slug) {
				tech.isSelected = !isSelected(slug);
			}

			return tech;
		});
	};

	let result = $derived(
		items.filter((project) => {
			const isFiltered =
				filters.every((item) => !item.isSelected) ||
				project.skills.some((tech) =>
					filters.some((filter) => filter.isSelected && filter.slug === tech.slug)
				);

			const isSearched =
				search.trim().length === 0 ||
				project.name.trim().toLowerCase().includes(search.trim().toLowerCase());

			return isFiltered && isSearched;
		})
	);

	const onSearch = (query: string) => (search = query);
</script>

<SearchPage {title} {onSearch}>
	<div class="projects-filters">
		{#each filters as tech}
			<Chip
				active={tech.isSelected}
				classes={'text-0.8em'}
				onclick={() => toggleSelected(tech.slug)}
			>
				{#if tech.isSelected}
					<UIcon icon="i-carbon-close" />
				{/if}
				{tech.name}
			</Chip>
		{/each}
	</div>
	{#if result.length === 0}
		<div class="p-5 m-t-10 mb-100 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-carbon-help" classes="text-2.5em" />
			<p class="font-300">Could not find anything...</p>
		</div>
	{:else}
		<div class="projects-list mt-5">
			{#each result as project}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</SearchPage>

<style lang="scss">
	.projects-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;

		@media (max-width: 1350px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 850px) {
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>

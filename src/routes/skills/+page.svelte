<script lang="ts">
	import type { Experience, Project, Skill } from '$lib/types';
	import { items, title } from '@data/skills';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import SkillCard from '$lib/components/SkillCard/SkillCard.svelte';
	import * as projects from '@data/projects';
	import * as experiences from '@data/experience';

	let search = $state('');

	let result: Skill[] = $derived(
		items.filter((skill) => {
			const isSearched =
				search.trim().length === 0 ||
				skill.name.trim().toLowerCase().includes(search.trim().toLowerCase());
			return isSearched;
		})
	);

	const skill2RelatedCount = new Map<string, number>();

	const compareFn = (a: Skill, b: Skill) => {
		const countA = skill2RelatedCount.get(a.slug)!;
		const countB = skill2RelatedCount.get(b.slug)!;
		return countB - countA;
	};

	// find skill in projects or experience and count total occurences in skill2RelatedCount
	const findAndSet = (it: Project | Experience, skill: Skill) => {
		if (it.skills.some((tech) => tech.slug === skill.slug)) {
			skill2RelatedCount.set(skill.slug, skill2RelatedCount.get(skill.slug)! + 1);
		}
	};

	$effect.pre(() => {
		items.forEach((skill) => {
			skill2RelatedCount.set(skill.slug, 0);
			projects.items.forEach((proj) => findAndSet(proj, skill));
			experiences.items.forEach((exp) => findAndSet(exp, skill));
		});

		result.sort(compareFn);
	});

	const onSearch = (query: string) => {
		search = query;
		result.sort(compareFn);
	};
</script>

<SearchPage {title} {onSearch}>
	{#if result.length === 0}
		<div class="p-5 m-b-100 col-center gap-3 m-y-auto text-[var(--accent-text)] flex-1">
			<UIcon icon="i-carbon-help" classes="text-2.5em" />
			<p class="font-300">Could not find anything...</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-5 mt-10">
			{#each result as skill}
				<SkillCard {skill} />
			{/each}
		</div>
	{/if}
</SearchPage>

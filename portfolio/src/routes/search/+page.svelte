<script lang="ts">
	import type { Icon, Item, Skill } from '$lib/types';

	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { title } from '@data/search';
	import { filterItemsByQuery, type ItemOrSkill } from '$lib/utils/helpers';
	import * as Experiences from '@data/experience';
	import * as Education from '@data/education';
	import * as Projects from '@data/projects';
	import * as Skills from '@data/skills';
	import SearchPage from '$lib/components/SearchPage.svelte';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import { NAMED_COLORS } from '$lib/utils/colors';
	import type { Pathname } from '$app/types';

	type Item = {
		name: string;
		// logo: string;
		link: Pathname;
		color: string;
	};

	type Group = {
		icon: `i-carbon-${string}`;
		name: string;
		items: Array<Item>;
	};

	let search = $state('');

	const getResult = (q: string): Array<Group> => {
		const skills = Skills.items.filter((it) => it.name.toLowerCase().includes(q.toLowerCase()));

		const projects = Projects.items.filter((it) => it.name.toLowerCase().includes(q.toLowerCase()));

		const experience = Experiences.items.filter(
			(it) =>
				it.name.toLowerCase().includes(q.toLowerCase()) ||
				it.company.toLowerCase().includes(q) ||
				it.location.toLowerCase().includes(q)
		);

		// const education = Education.items.filter(
		// 	(it) =>
		// 		it.name.toLowerCase().includes(q.toLowerCase()) ||
		// 		it.degree.toLowerCase().includes(q) ||
		// 		it.location.toLowerCase().includes(q) ||
		// 		it.organization.toLowerCase().includes(q)
		// );

		const groups: Array<Group> = [];

		if (skills.length) {
			groups.push({
				icon: 'i-carbon-assembly-cluster',
				name: 'Skills',
				items: skills.map((it) => ({
					name: it.name,
					// logo: $mode === 'dark' ? it.logo.dark : it.logo.light,
					link: `/skills/${it.slug}`,
					color: it.color
				}))
			});
		}

		if (projects.length) {
			groups.push({
				icon: 'i-carbon-cube',
				name: 'Projects',
				items: projects.map((it) => ({
					name: it.name,
					// logo: $mode === 'dark' ? it.logo.dark : it.logo.light,
					link: `/projects/${it.slug}`,
					color: it.color
				}))
			});
		}

		if (experience.length) {
			groups.push({
				icon: 'i-carbon-development',
				name: 'Experience',
				items: experience.map((it) => ({
					name: it.name,
					// logo: $mode === 'dark' ? it.logo.dark : it.logo.light,
					link: `/experience/${it.slug}`,
					color: it.color
				}))
			});
		}

		// if (education.length) {
		// 	groups.push({
		// 		icon: 'i-carbon-education',
		// 		name: 'Education',
		// 		items: education.map((it) => ({
		// 			name: it.degree,
		// 			// logo: $mode === 'dark' ? it.logo.dark : it.logo.light,
		// 			link: `/education/${it.slug}`,
		// 			color: NAMED_COLORS.gray
		// 		}))
		// 	});
		// }

		return groups;
	};

	let result = $derived(getResult(search));

	const onSearch = (query: string) => (search = query);
</script>

<SearchPage {title} {onSearch} autoFocusSearch={true}>
	<div class="col items-stretch gap-10 p-2"></div>
	{#if !search}
		<div
			class="flex-1 self-center col-center m-t-10 mb-100 gap-5 font-300 text-[var(--accent-text)]"
		>
			<UIcon icon="i-carbon-search-locate-mirror" classes="text-2.5em" />
			<p class="font-300">Search this website...</p>
		</div>
	{:else if result.length === 0}
		<div
			class="flex-1 self-center col-center m-t-10 mb-100 gap-5 font-300 text-[var(--accent-text)]"
		>
			<UIcon icon="i-carbon-help" classes="text-2.5em" />
			<p class="font-300">Could not find anything...</p>
		</div>
	{:else}
		<div class="row flex-wrap gap-1">
			{#each result as item (item.name)}
				{#each item.items as it (it.name)}
					<Chip href={resolve(it.link)} classes="row items-center gap-2">
						<!-- <UIcon icon={it.logo} classes="text-1.2em" /> -->
						<span>{it.name}</span>
					</Chip>
				{/each}
			{/each}
		</div>
	{/if}
</SearchPage>

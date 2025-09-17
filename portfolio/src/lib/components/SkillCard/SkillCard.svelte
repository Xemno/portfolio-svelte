<script lang="ts">
	import type { Pathname } from '$app/types';
	import type { Skill } from '$lib/types';

	import { getAssetURL } from '$lib/data/assets';
	import { resolve } from '$app/paths';
	import Card from '../Card/Card.svelte';
	import CardTitle from '../Card/CardTitle.svelte';
	import CardLink from '../Card/CardLink.svelte';
	import CardDivider from '../Card/CardDivider.svelte';
	// import ChipIcon from '../Chip/ChipIcon.svelte';
	// import CardLogo from '../Card/CardLogo.svelte';
	import UIcon from '../Icon/UIcon.svelte';
	import { title } from '@data/skills';
	import * as projects from '@data/projects';
	import * as experiences from '@data/experience';
	import CardLogo from '../Card/CardLogo.svelte';
	import Chip from '../Chip/Chip.svelte';

	type Related = {
		display: string;
		name: string;
		img: string;
		type: 'projects' | 'experience';
		url: Pathname;
	};

	interface Props {
		skill: Skill;
	}

	let { skill }: Props = $props();

	// NOTE: search for related projects to that skill and show on the bottom
	const getRelatedProjects = (): Array<Related> => {
		const out: Array<Related> = [];

		// const skill = data.skill;

		if (!skill) {
			return [];
		}

		projects.items.forEach((item) => {
			if (item.skills.some((tech) => tech.slug === skill.slug)) {
				out.push({
					img: getAssetURL(item.logo),
					display: `${item.name} (${item.type})`,
					name: item.name,
					type: 'projects',
					url: `/projects/${item.slug}`
				});
				console.log('typeof: ', item.logo, '  ', typeof item.logo);
			}
		});

		experiences.items.forEach((item) => {
			if (item.skills.some((tech) => tech.slug === skill.slug)) {
				out.push({
					img: getAssetURL(item.logo),
					display: `${item.name} @ ${item.company}`,
					name: item.name,
					type: 'experience',
					url: `/experience/${item.slug}`
				});
				console.log('typeof: ', item.logo, '  ', typeof item.logo);
			}
		});

		return out;
	};

	// let computedTitle = $derived(skill ? `${skill.name} - ${title}` : title);

	let related = $derived(skill ? getRelatedProjects() : []);

	// let assetLogo = $derived(getAssetURL(skill.logo));
</script>

{#if skill === undefined}
	<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)]">
		<UIcon icon="i-carbon-software-resource-cluster" classes="text-3.5em" />
		<p class="font-300">Could not load skill data.</p>
	</div>
{:else}
	<Card classes={['decoration-none']} tiltDegree={5} bgImg={skill.logo} color={skill.color}>
		<CardTitle title={skill.name} />

		<CardDivider />

		{#if related.length == 0}
			<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)]">
				<UIcon icon="i-carbon-software-resource-cluster" classes="text-1.5em" />
				<p class="text-0.75em md:text-0.8em">No related projects yet.</p>
			</div>
		{:else}
			<div class="row gap-0 self-stretch flex-wrap">
				{#each related as item}
					<Chip
						classes="inline-flex flex-row items-center justify-center w-full"
						href={resolve(item.url)}
					>
						<CardLogo
							src={'i-line-md-chevron-small-right'}
							alt={item.name}
							radius={'0px'}
							size={20}
							classes="mr-1 md:mr-2 text-1.0em md:text-1.2em h-8 md:h-5"
						/>
						<span class="text-0.75em md:text-0.8em line-clamp-1 w-full">{item.display}</span>
					</Chip>
				{/each}
			</div>
		{/if}
	</Card>
{/if}

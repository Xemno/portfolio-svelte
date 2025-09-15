<script lang="ts">
	import type { Pathname } from '$app/types';
	import type { Skill } from '$lib/types';

	import { getAssetURL } from '$lib/data/assets';
	import { resolve } from '$app/paths';
	import Card from '../Card/Card.svelte';
	import CardTitle from '../Card/CardTitle.svelte';
	import CardLink from '../Card/CardLink.svelte';
	import CardDivider from '../Card/CardDivider.svelte';
	import ChipIcon from '../Chip/ChipIcon.svelte';
	import CardLogo from '../Card/CardLogo.svelte';
	import UIcon from '../Icon/UIcon.svelte';
	import { title } from '@data/skills';
	import * as projects from '@data/projects';
	import * as experiences from '@data/experience';

	type Related = {
		display: string;
		name: string;
		img: string;
		type: 'projects' | 'experience';
		url: Pathname;
	};

	interface Props {
		data: { skill: Skill };
	}

	let { data }: Props = $props();

	// NOTE: search for related projects to that skill and show on the bottom
	const getRelatedProjects = (): Array<Related> => {
		const out: Array<Related> = [];

		const skill = data.skill;

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

	let computedTitle = $derived(data.skill ? `${data.skill.name} - ${title}` : title);

	let related = $derived(data.skill ? getRelatedProjects() : []);
</script>

{#if data.skill === undefined}
	<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)]">
		<UIcon icon="i-carbon-software-resource-cluster" classes="text-3.5em" />
		<p class="font-300">Could not load skill data.</p>
	</div>
{:else}
	<Card
		classes={['cursor-pointer decoration-none']}
		tiltDegree={5}
		href={resolve(`/skills/${data.skill.slug}`)}
		bgImg={getAssetURL(data.skill.logo)}
		color={data.skill.color}
	>
		<CardTitle title={data.skill.name} />

		<p class="text-[var(--tertiary-text)]">{data.skill.name}</p>

		<CardDivider />

		<CardDivider />
	</Card>
{/if}

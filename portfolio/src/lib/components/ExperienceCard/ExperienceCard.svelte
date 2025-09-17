<script lang="ts">
	import type { Experience } from '$lib/types';

	import { resolve } from '$app/paths';
	import { getMonthName, getTimeDiff } from '$lib/utils/helpers';
	import { getAssetURL } from '$lib/data/assets';
	import Card from '../Card/Card.svelte';
	import CardTitle from '../Card/CardTitle.svelte';
	import ChipIcon from '../Chip/ChipIcon.svelte';
	import UIcon from '../Icon/UIcon.svelte';
	import Markdown from '../Markdown.svelte';

	interface Props {
		experience: Experience;
	}

	let { experience }: Props = $props();

	const months = getTimeDiff(experience.period.from, experience.period.to);

	const from = `${getMonthName(
		experience.period.from.getMonth()
	)} ${experience.period.from.getFullYear()}`;
	const to = experience.period.to
		? `${getMonthName(experience.period.to.getMonth())} ${experience.period.to.getFullYear()}`
		: 'Present';

	const period = `${from} - ${to} · ${months}`;
</script>

<Card
	margin="0px 0px 20px 0px"
	tiltDegree={2}
	href={resolve(`/experience/${experience.slug}`)}
	color={experience.color}
>
	<div class="col md:flex-row items-start gap-5 md:gap-1">
		<UIcon icon={experience.logo} classes="text-3.5em" />
		<div class="col ml-0 md:ml-[20px] gap-2 w-full">
			<CardTitle title={experience.name} />
			<div class="row flex-wrap m-b-2 gap-1 text-0.9em font-300">
				<ChipIcon name={`Company: ${experience.company}`}>
					<div class="row items-center gap-2">
						<UIcon icon="i-carbon-building" />
						{experience.company}
					</div>
				</ChipIcon>
				<ChipIcon name={`Location: ${experience.location}`}>
					<UIcon icon="i-carbon-location" />
				</ChipIcon>
				<ChipIcon name={`Contract: ${experience.contract}`}>
					<UIcon icon="i-carbon-hourglass" />
				</ChipIcon>
			</div>

			<div class="row items-center gap-2">
				<UIcon icon="i-carbon-calendar" classes="text-1.25em" />
				<div class="text-[var(--accent-text)] text-[0.9em] font-200">{period}</div>
			</div>

			<div class="sm:text-[0.9em] text-[0.8em] text-[var(--secondary-text)]">
				{#if experience.shortDescription}
					<Markdown content={experience.shortDescription ?? 'This place is yet to be filled...'} />
				{:else}
					<div class="p-5 col-center gap-3 m-y-auto text-[var(--border)]">
						<UIcon icon="i-carbon-text-font" classes="text-3.5em" />
						<p class="font-300">No description...</p>
					</div>
				{/if}
			</div>
			<div class="row flex-wrap mt-5">
				{#each experience.skills as skill}
					<ChipIcon logo={getAssetURL(skill.logo)} name={skill.name} />
				{/each}
			</div>
		</div>
	</div>
</Card>

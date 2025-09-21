<script lang="ts">
	import type { Project } from '$lib/types';

	import { getAssetURL } from '$lib/data/assets';
	import { resolve } from '$app/paths';
	import { getMonthName, getTimeDiff } from '$lib/utils/helpers';
	import Card from '../Card/Card.svelte';
	import CardTitle from '../Card/CardTitle.svelte';
	import CardLink from '../Card/CardLink.svelte';
	import CardDivider from '../Card/CardDivider.svelte';
	import ChipIcon from '../Chip/ChipIcon.svelte';
	import CardLogo from '../Card/CardLogo.svelte';
	import UIcon from '../Icon/UIcon.svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
	// let months = $derived(countMonths(project.period.from, project.period.to));
	// $: period = `${months} month${months > 1 ? 's' : ''}`;
	let period = $derived(
		`${getTimeDiff(
			project.period.from,
			project.period.to ?? new Date(Date.now() + 1000 * 60 * 60 * 24)
		)}`
	);
	let from = $derived(
		`${getMonthName(project.period.from.getMonth())} ${project.period.from.getFullYear()}`
	);
	let to = $derived(
		project.period.to
			? `${getMonthName(project.period.to.getMonth())} ${project.period.to.getFullYear()}`
			: 'now'
	);

	const customChipClass =
		'py-[5px] px-[15px] m-[2.5px] decoration-none inline-block border-[1px] border-solid border-[var(--border)] rounded-[20px] tracking-wider text-[0.9em] text-[var(--tertiary-text)] duration-[150ms] font-light';
</script>

<Card color={project.color} href={resolve(`/projects/${project.slug}`)}>
	{#if project.slug == 'my-portfolio-website'}
		<UIcon icon="i-line-md-coffee-loop" classes="text-2em" />
	{:else}
		<CardLogo
			alt={project.name}
			src={project.logo}
			classes="object-scale-down max-h-12 w-fit object-fit "
		/>
	{/if}

	<div class="m-t-20px row justify-between items-center">
		<CardTitle title={project.name} />
		<div class="row">
			{#each project.links as link}
				<CardLink label={link.label ?? ''} to={link.to} />
			{/each}
		</div>
	</div>

	<CardDivider />
	<div
		class="col m-b-10px justify-between text-[var(--secondary-text)] text-0.9em font-italic font-300"
	>
		<div class="row items-center gap-2 mb-2">
			<UIcon icon="i-carbon-assembly-cluster" classes="text-1.25em" />
			<p>{project.type}</p>
		</div>

		<div class="row items-center gap-2 mb-2">
			<UIcon icon="i-carbon-time" classes="text-1.25em" />
			<p>{period}</p>
		</div>
	</div>
	<div class="col sm:h-100px md:h-160px">
		<p class="text-[0.9em] text-[var(--secondary-text)] font-300 m-t-20px m-b-40px line-clamp-4">
			{project.shortDescription}
		</p>
	</div>
	<div class="row justify-between text-0.8em font-400">
		<div class={customChipClass}>{from}</div>
		{#if from !== to}
			<div class={customChipClass}>{to}</div>
		{/if}
	</div>
	<CardDivider />
	<div class="row flex-wrap">
		{#each project.skills as tech}
			<ChipIcon logo={getAssetURL(tech.logo)} name={tech.name} />
		{/each}
	</div>
</Card>

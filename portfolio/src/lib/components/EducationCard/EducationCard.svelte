<script lang="ts">
	import type { Education } from '$lib/types';

	import { getTimeDiff, getMonthAndYear } from '$lib/utils/helpers';
	import Card from '../Card/Card.svelte';
	import CardLogo from '../Card/CardLogo.svelte';
	import UIcon from '../Icon/UIcon.svelte';
	import ChipStatic from '../Chip/ChipStatic.svelte';
	import CardTitle from '../Card/CardTitle.svelte';

	interface Props {
		education: Education;
	}

	let { education }: Props = $props();
</script>

<Card margin="0px 0px 0px 0px" tiltDegree={5} color={education.color}>
	<div class="flex-1 col gap-2 items-stretch">
		<div class="row justify-between">
			<div class="">
				<CardTitle title={education.degree} />
				<div class="mb-2">{education.organization}</div>
				<div class="col text-[var(--accent-text)] text-[0.9em] font-200">
					<div class="row items-center gap-2 mb-1">
						<UIcon icon="i-carbon-location" />
						{education.location}
					</div>

					<div class="row items-center gap-2 mb-1">
						<UIcon icon="i-carbon-calendar" />
						{getMonthAndYear(education.period.from)} - {getMonthAndYear(education.period.to)}
					</div>

					<div class="row items-center gap-2 mb-1">
						<UIcon icon="i-carbon-time" />
						{getTimeDiff(education.period.from, education.period.to)}
					</div>
				</div>
			</div>

			<CardLogo
				src={education.logo}
				alt={education.name}
				size={75}
				classes="object-scale-down max-h-12 w-fit object-fit "
			/>
		</div>

		<div class="row flex-wrap gap-1 sm:overflow-y-auto sm:max-h-30">
			{#each education.majors as subject}
				<ChipStatic>{subject}</ChipStatic>
			{/each}
		</div>
	</div>
</Card>

<script lang="ts">
	import type { Education } from '$lib/types';
	import { getTimeDiff } from '$lib/utils/helpers';
	import { getAssetURL } from '$lib/data/assets';
	import Chip from '../Chip/Chip.svelte';
	import Card from '../Card/Card.svelte';
	import CardLogo from '../Card/CardLogo.svelte';

	export let education: Education;
</script>

<Card margin="0px 0px 0px 0px" tiltDegree={5} color={education.color}>
	<div class="flex-1 col gap-2 items-stretch">
		<div class="row justify-between">
			<div class="">
				<div class="text-[1.3em]">{education.degree}</div>
				<div>{education.organization}</div>
				<div class="text-[var(--accent-text)] text-[0.9em] font-200 mb-2">
					{education.location} · {getTimeDiff(education.period.from, education.period.to)}
				</div>
			</div>

			<CardLogo src={getAssetURL(education.logo)} alt={education.name} size={75} />
		</div>

		<!--  NOTE:		<div class="row flex-wrap gap-1 sm:overflow-y-auto sm:max-h-20"> in order to enable scrollbar
			 -->
		<div class="row flex-wrap gap-1">
			{#each education.subjects as subject}
				<Chip>{subject}</Chip>
			{/each}
		</div>
	</div>
</Card>

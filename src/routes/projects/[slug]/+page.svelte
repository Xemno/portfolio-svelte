<script lang="ts">
	import type { Project } from '$lib/types';

	import { getAssetURL } from '$lib/data/assets';
	import { title } from '@data/projects';
	import { detectMobile } from '$lib/stores/navigation';
	import CardLogo from '$lib/components/Card/CardLogo.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import TabTitle from '$lib/components/TabTitle.svelte';
	import Chip from '$lib/components/Chip/Chip.svelte';
	import Banner from '$lib/components/Banner/Banner.svelte';
	import UIcon from '$lib/components/Icon/UIcon.svelte';
	import CardDivider from '$lib/components/Card/CardDivider.svelte';
	import ChipIcon from '$lib/components/Chip/ChipIcon.svelte';

	interface Props {
		data: { project?: Project };
	}

	let { data }: Props = $props();

	const isMobile = detectMobile();
	let computedTitle = $derived(data.project ? `${data.project.name} - ${title}` : title);
</script>

<TabTitle title={computedTitle} />

<div class="col flex-1 pb-10">
	{#if data.project === undefined}
		<div class="p-5 col-center gap-3 m-y-auto text-[var(--accent-text)]">
			<UIcon icon="i-carbon-cube" classes="text-3.5em" />
			<p class="font-300">Could not load project data...</p>
		</div>
	{:else}
		<div class="col items-center">
			<Banner>
				<div class="col-center p-y-20">
					<div class="text-0.9em">
						{#if isMobile}
							<MainTitle>{data.project.name}</MainTitle>
						{:else}
							<MainTitle classes="py-10">{''}</MainTitle>
						{/if}
					</div>
					<p class="font-300 text-center text-[var(--tertiary-text)] m-y-2">{data.project.type}</p>
					<div class="w-75%">
						<CardDivider />
					</div>
					<div class="row-center flex-wrap text-[0.9em] text-[var(--tertiary-text)] m-b-2">
						{#each data.project.links as item}
							<Chip href={item.to}>
								<div class="row-center gap-2">
									<UIcon icon="i-carbon-link" />
									<span>{item.label}</span>
								</div>
							</Chip>
						{/each}
					</div>
					<div class="row-center flex-wrap m-b-2">
						{#each data.project.skills as item}
							<ChipIcon name={`Skill: ${item.name}`}>
								<CardLogo
									src={getAssetURL(item.logo)}
									alt={item.name}
									radius={'0px'}
									size={15}
									classes="mr-2"
								/>
								<span class="text-[0.9em]">{item.name}</span>
							</ChipIcon>
						{/each}
					</div>
				</div>
			</Banner>

			<div class="pb-1 w-full">
				<div class="blurred-box m-y-2">
					{#if data.project.description}
						<Markdown content={data.project.description} />
					{:else}
						<div class="p-5 col-center gap-3 m-y-auto text-[var(--border)]">
							<UIcon icon="i-carbon-text-font" classes="text-3.5em" />
							<p class="font-300">No description</p>
						</div>
					{/if}
				</div>
				<div class="w-100% m-t-8">
					<CardDivider />
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
</style>

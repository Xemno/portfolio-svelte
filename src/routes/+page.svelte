<script lang="ts">
	import { titleSuffix } from '@data/app';
	import { links, description, title, name, lastName } from '@data/home';
	import { isEmail, useTitle } from '$lib/utils/helpers';
	import { detectMobile } from '$lib/stores/navigation';
	import { getPlatfromIcon } from '$lib/utils';
	import Markdown from '$lib/components/Markdown.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import Icon from '$lib/components/Icon/Icon.svelte';

	const isMobile = detectMobile();
</script>

<svelte:head>
	<title>{useTitle(title, titleSuffix)}</title>
</svelte:head>

<div
	class="col self-center flex-1 md:flex-row md:slef-stretch justify-center lg:justify-between items-center p-y-5px p-x-10px"
>
	<div class="md:flex-1 gap-10px">
		{#if isMobile}
			<MainTitle classes="md:text-left py-5 md:max-w-2/3">{name} {lastName}</MainTitle>
		{:else}
			<MainTitle classes="md:text-left py-15 md:max-w-2/3">{''} {''}</MainTitle>
		{/if}
		<p class="text-[var(--tertiary-text)] text-center md:text-left text-[1.2em] font-extralight">
			<Markdown content={description ?? 'This has yet to be filled...'} />
		</p>
		<div class="row justify-center md:justify-start p-y-15px p-x-0px md:p-x-20px gap-2">
			{#each links as link}
				<a
					class="decoration-none"
					href={`${isEmail(link.link) ? 'mailto:' : ''}${link.link}`}
					target="_blank"
					rel="noreferrer"
				>
					<Icon icon={getPlatfromIcon(link.platform)} color={'var(--accent-text)'} size={'20px'} />
				</a>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import { titleSuffix } from '@data/app';
	import { links, description, title } from '@data/home';
	import { useTitle } from '$lib/utils/helpers';
	import { isBlank } from '$lib/utils/helpers';
	import { getPlatfromIcon } from '$lib/utils';
	import Markdown from '$lib/components/Markdown.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import Icon from '$lib/components/Icon/Icon.svelte';

	// TODO: move to utility class
	const isEmail = (email: string): boolean => {
		const reg =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return !isBlank(email) && reg.test(email);
	};
</script>

<svelte:head>
	<title>{useTitle(title, titleSuffix)}</title>
</svelte:head>

<div
	class="col self-center flex-1 md:flex-row md:slef-stretch justify-center lg:justify-between items-center p-y-5px p-x-10px"
>
	<div class="md:flex-1 gap-10px">
		<MainTitle classes="md:text-left py-10 md:max-w-2/3">{''} {''}</MainTitle>
		<p class="text-[var(--tertiary-text)] text-center md:text-left text-[1.2em] font-extralight">
			<Markdown content={description ?? 'This has yet to be filled...'} />
		</p>
		<div class="row justify-center md:justify-start p-y-15px p-x-0px gap-2">
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

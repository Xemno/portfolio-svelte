<script lang="ts">
	import Carrousel from '$lib/components/Carrousel/Carrousel.svelte';
	import Icon from '$lib/components/Icon/Icon.svelte';
	import MainTitle from '$lib/components/MainTitle/MainTitle.svelte';
	import { TITLE_SUFFIX } from '$lib/params';
	import { HOME, getPlatfromIcon } from '$lib/params';
	import MY_SKILLS from '$lib/skills.params';
	import { useTitle } from '$lib/utils/helpers';

	const { description, lastName, links, name, title, skills } = HOME;

	const isEmail = (email: string): boolean => {
		const reg =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		// return !isBlank(email) && reg.test(email);
		return reg.test(email);
	};
</script>

<svelte:head>
	<title>{useTitle(title, TITLE_SUFFIX)}</title>
</svelte:head>

<div
	class="col self-center flex-1 md:flex-row md:slef-stretch justify-center lg:justify-between items-center p-y-5px p-x-10px"
>
	<div class="md:flex-1 gap-10px">
		<MainTitle classes="md:text-left animate-fade-in">{name} {lastName}</MainTitle>
		<p class="text-[var(--tertiary-text)] text-center md:text-left text-[1.2em] font-extralight">
			{description}
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

		<!-- NOTE: test layout for Noise and Height Coefficients-->
		<div class="col justify-center md:justify-start p-y-15px p-x-0px gap-2">
			<div class="form-group col-sm-6">
				<label for="noiseInput" class="form-label">Noise Coef</label>
				<input type="range" min="1" max="100" class="custom-range" id="noiseInput" />
			</div>
			<div class="form-group col-sm-6">
				<label for="heightInput" class="form-label">Height Coef</label>
				<input type="range" min="1" max="100" class="custom-range" id="heightInput" />
			</div>
		</div>
		<button id="trigger" class="primary"> Random Colors </button>
		<!-- NOTE: test layout -->
	</div>
	<Carrousel items={skills ?? MY_SKILLS} />
</div>

<!-- <div
	class="col self-center flex-[0.5] md:flex-row md:slef-stretch justify-center lg:justify-between items-center p-y-5px p-x-10px border-dotted border-amber"
> -->
<!-- <canvas id="" bind:this={el} /> -->

<!-- </div> -->

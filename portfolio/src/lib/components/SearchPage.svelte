<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import CommonPage from './CommonPage.svelte';
	import SearchInput from './Input/SearchInput.svelte';

	interface Props {
		title: string;
		onSearch: (value: string) => void;
		autoFocusSearch?: boolean;
		children?: Snippet;
	}

	let { title = 'Untitled', onSearch, autoFocusSearch, children }: Props = $props();

	let query = $state('');
	let mounted = $state(false);

	$effect(() => {
		if (browser && mounted) {
			let searchParams = new URLSearchParams(window.location.search);

			searchParams.set('q', query);

			const url = `${window.location.protocol}//${window.location.host}${
				window.location.pathname
			}?${searchParams.toString()}`;

			const state = window.history.state;

			window.history.replaceState(state, '', url);

			onSearch(query);
		}
	});

	onMount(() => {
		let searchParams = new URLSearchParams(window.location.search);
		query = searchParams.get('q') ?? '';
		mounted = true;
	});
</script>

<CommonPage {title}>
	<!-- NOTE: Search bar -->
	<div class="w-100% row">
		<SearchInput bind:value={query} placeholder={'Search...'} {autoFocusSearch} />
	</div>

	<!-- NOTE: Content with projects / skills / work experience cards -->
	<div class="w-100% col flex-1">
		{@render children?.()}
	</div>
</CommonPage>

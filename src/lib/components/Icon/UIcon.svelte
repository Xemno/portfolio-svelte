<script lang="ts">
	import type { Icon } from "$lib/types";

	interface Props {
		icon?: Icon;
		classes?: string;
	}

	let { icon = undefined, classes = '' }: Props = $props();
</script>

<i class={`${icon} ${classes}`}></i>

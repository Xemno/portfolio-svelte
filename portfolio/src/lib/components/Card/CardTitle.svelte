<script lang="ts">
	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<h3 class="text-1.25em items-start sm:gap-5 md:gap-0 font-[var(--title-f)]">{title}</h3>

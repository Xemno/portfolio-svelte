<script lang="ts">
	// export let img = '';
	export let classes = '';
</script>

<div
	class={`row w-full py-8 text-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]  lg:min-h-[350px] ${classes}`}
>
	<div class="col flex-1 p-x-2">
		<slot />
	</div>
</div>

<!-- <style lang="scss">
	.skill-cover {
		background: linear-gradient(90deg, var(--main) 0%, var(--main) 55%, var(--main-60) 130%),
			no-repeat 110% 45% / 50% var(--bg-img);
	}
</style> -->

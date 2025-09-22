import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');
const base = dev ? '' : '/portfolio-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html' 
		}),
		prerender: {
			// use relative URLs similar to an anchor tag <a href="/test/1"></a>
			// do not include group layout folders in the path such as /(group)/test/1
			entries: [
				'/',
				'/education',
				'/experience',
				'/projects',
				'/search',
				'/skills',
				'/projects/my-portfolio-website',
				'/projects/dr1ve-website',
				'/projects/master-thesis',
				'/projects/bachelor-thesis',
				'/projects/mr-lab-eth',
				'/projects/fast-cpu-raymarcher',
				'/projects/soft-body-physics-engine',
				'/projects/ai-road-segmentation',
				'/experience/qualitas-ag',
				'/experience/urban-games'
			]
		},
		alias: {
			$lib: './src/lib',
			'@data': './src/lib/data',
			'@graphics': './src/lib/graphics',
			'@components': './src/lib/components',
			'@md': './src/lib/md',
			'@stores': './src/lib/stores',
			'@utils': './src/lib/utils'
		},
		paths: {
			base: base
		}
	}
};

export default config;

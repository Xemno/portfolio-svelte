// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'


export default defineConfig({
  plugins: [
	sveltekit(),
	UnoCSS(),
	glsl()
  ],
})
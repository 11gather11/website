import type { AstroIntegration } from '@swup/astro'

// Pagefind検索結果の型
interface PagefindSearchResult {
	url: string
	meta: {
		title: string
	}
	excerpt: string
}

interface PagefindResult {
	results: Array<{
		data: () => Promise<PagefindSearchResult>
	}>
}

interface Pagefind {
	init: () => void
	search: (query: string) => Promise<PagefindResult>
	options: (options: { excerptLength?: number }) => Promise<void>
}

declare global {
	interface Window {
		swup: AstroIntegration
		pagefind: Pagefind
	}

	// グローバルスコープでpagefindを使用可能にする
	const pagefind: Pagefind
}

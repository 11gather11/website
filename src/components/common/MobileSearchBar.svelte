<script lang="ts">
import Icon from '@iconify/svelte'
import { OverlayScrollbars } from 'overlayscrollbars'
import { onDestroy, onMount } from 'svelte'

// 検索結果の型定義
interface SearchResult {
	url: string
	meta: {
		title: string
	}
	excerpt: string
}

// 状態管理
let searchKeyword = ''
let searchResult: SearchResult[] = []
let searchBarDisplay = false
let isSearching = false

// DOM要素への参照
let resultPanel: HTMLDivElement
let searchBar: HTMLDivElement
let searchButton: HTMLButtonElement

// 定数
const RESULT_ITEM_HEIGHT = 84
const RESULT_PANEL_PADDING = 16
const MAX_VISIBLE_RESULTS = 5

// 検索関数（初期化後に設定される）
let search = (_keyword: string) => {}

// 外部クリックハンドラー
let handleOutsideClick: (event: MouseEvent) => void

onMount(async () => {
	// オーバーレイスクロールバーの設定
	OverlayScrollbars(resultPanel, {
		scrollbars: {
			theme: 'scrollbar-base scrollbar-auto py-1',
			autoHide: 'move',
		},
	})

	/**
	 * キーワードに基づいて非同期検索を実行
	 *
	 * Pagefind検索エンジンを使用して結果を取得し、
	 * 結果パネルの表示/非表示と高さを制御します。
	 *
	 * @param keyword - 検索キーワード
	 */
	search = async (keyword: string) => {
		if (!keyword.trim()) {
			searchResult = []
			return
		}

		try {
			isSearching = true
			const searchResultArr: SearchResult[] = []

			// @ts-ignore - Pagefindはグローバルに注入される
			const ret = await pagefind.search(keyword)

			for (const item of ret.results) {
				searchResultArr.push(await item.data())
			}

			searchResult = searchResultArr
		} catch (error) {
			console.error('検索中にエラーが発生しました:', error)
			searchResult = []
		} finally {
			isSearching = false
		}
	}

	// 外部クリックハンドラーの設定
	handleOutsideClick = (event: MouseEvent) => {
		const target = event.target as Node

		if (
			!resultPanel?.contains(target) &&
			!searchBar?.contains(target) &&
			!searchButton?.contains(target)
		) {
			closeSearchBar()
		}
	}

	document.addEventListener('click', handleOutsideClick)
})

onDestroy(() => {
	// イベントリスナーのクリーンアップ
	if (handleOutsideClick) {
		document.removeEventListener('click', handleOutsideClick)
	}
})

/**
 * 検索バーの表示/非表示を切り替え
 */
const toggleSearchBar = () => {
	searchBarDisplay = !searchBarDisplay

	if (!searchBarDisplay) {
		searchKeyword = ''
		search('')
	}
}

/**
 * 検索バーを閉じる
 */
const closeSearchBar = () => {
	searchBarDisplay = false
	searchKeyword = ''
	search('')
}

/**
 * 検索入力時の処理
 */
const handleSearchInput = () => {
	search(searchKeyword)
}

// 反応的な変数：検索結果の表示状態
$: searchResultVisible = searchKeyword !== '' && searchResult.length > 0

// 反応的な変数：結果パネルの高さ計算
$: resultPanelHeight = searchResultVisible
	? Math.min(searchResult.length, MAX_VISIBLE_RESULTS) * RESULT_ITEM_HEIGHT +
		RESULT_PANEL_PADDING
	: 0

// 反応的な処理：検索キーワードの変更時
$: if (searchKeyword !== undefined) {
	handleSearchInput()
}
</script>

<div class="lg:hidden">
	<button
		type="button"
		bind:this={searchButton}
		on:click={toggleSearchBar}
		class="flex w-11 justify-center rounded-lg py-2 text-foreground transition-all hover:bg-primary-hover hover:text-primary"
		aria-label="検索を開く"
	>
		<Icon icon="line-md:search" height={24} width={24} />
	</button>
</div>

<!-- モバイル検索バー -->
<div class="fixed w-full z-20 top-[4.5rem] left-1/2 -translate-x-1/2">
	<!-- 検索入力パネル -->
	<div
		bind:this={searchBar}
		class="absolute left-1/2 -translate-x-1/2 w-[95%] px-1 flex flex-col transition-all overflow-hidden lg:hidden bg-card rounded-xl
			{searchBarDisplay 
				? 'h-12 opacity-100' 
				: 'h-0 opacity-0'
			}
			before:content-[''] after:content-[''] before:pt-1 after:pb-1"
	>
		<div class="bg-black/5 dark:bg-white/5 h-10 rounded-lg flex flex-row">
			<label
				for="search-bar-input-mobile"
				class="w-10 h-10 flex flex-row justify-center items-center pl-2 pr-1 hover:cursor-text text-gray-400"
			>
				<Icon icon="line-md:search" width={24} height={24} />
			</label>
			<input
				id="search-bar-input-mobile"
				class="text-foreground grow bg-transparent outline-none transition-all placeholder:text-foreground-lighten"
				placeholder="検索"
				type="text"
				autocomplete="off"
				bind:value={searchKeyword}
				aria-label="検索キーワードを入力"
			/>
			{#if isSearching}
				<div class="flex items-center pr-2">
					<Icon icon="line-md:loading-loop" width={16} height={16} />
				</div>
			{/if}
		</div>
	</div>

	<!-- 結果パネル -->
	<div
		bind:this={resultPanel}
		class="max-h-[436px] overflow-y-scroll absolute left-1/2 -translate-x-1/2 w-[95%] bg-card rounded-2xl top-[3.5rem] transition-all"
		style="height: {resultPanelHeight}px; opacity: {searchResultVisible ? '100%' : '0'}"
	>
		<div class="flex flex-col h-full onload-animation before:content-[''] before:pt-2 after:content-[''] after:pb-2">
			{#each searchResult as item (item.url)}
				<a
					href={item.url}
					class="mx-2 py-2 px-3 rounded-xl result-item transition-all hover:bg-black/5 dark:hover:bg-white/5"
					on:click={closeSearchBar}
				>
					<div class="flex flex-row space-x-1 items-center">
						<p class="line-clamp-1 text-lg font-semibold text-foreground result-title">
							{item.meta.title}
						</p>
						<span class="text-primary font-extrabold">
							<Icon icon="tabler:chevron-right" width={16} height={16} />
						</span>
					</div>
					<div class="h-10">
						<p class="item-excerpt text-sm line-clamp-2 text-foreground-lighten">
							{@html item.excerpt}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
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

// DOM要素への参照
let resultPanel: HTMLDivElement
let searchBar: HTMLDivElement

// 定数
const RESULT_ITEM_HEIGHT = 84
const RESULT_PANEL_PADDING = 16

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
		try {
			let searchResultArr: SearchResult[] = []

			if (keyword.trim()) {
				// @ts-ignore - Pagefindはグローバルに注入される
				const ret = await pagefind.search(keyword)
				for (const item of ret.results) {
					searchResultArr.push(await item.data())
				}
			}

			searchResult = searchResultArr

			const searchResultVisible = keyword !== '' && searchResult.length !== 0

			if (searchResultVisible) {
				resultPanel.style.height = `${searchResultArr.length * RESULT_ITEM_HEIGHT + RESULT_PANEL_PADDING}px`
				resultPanel.style.opacity = '100%'
			} else {
				resultPanel.style.height = '0px'
				resultPanel.style.opacity = '0'
			}
		} catch (error) {
			console.error('検索中にエラーが発生しました:', error)
			searchResult = []
			resultPanel.style.height = '0px'
			resultPanel.style.opacity = '0'
		}
	}

	// 外部クリックハンドラーの設定
	handleOutsideClick = (event: MouseEvent) => {
		const target = event.target as Node

		if (!resultPanel?.contains(target) && !searchBar?.contains(target)) {
			search('')
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

// 反応的な処理：検索キーワードの変更時
$: search(searchKeyword)
</script>

<!-- search bar -->
<div bind:this={searchBar} class="search-bar hidden lg:block">
	<div class="bg-black/5 dark:bg-white/5 h-10 rounded-lg flex flex-row">
		<label
			for="search-bar-input"
			class="w-10 h-10 flex flex-row justify-center items-center pl-2 pr-1 hover:cursor-text text-gray-400"
		>
			<Icon icon="line-md:search" width={24} height={24} />
		</label>
		<input
			id="search-bar-input"
			class="w-36 text-foreground xl:focus:w-60 bg-transparent outline-none transition-all placeholder:text-foreground-lighten"
			placeholder="検索"
			type="text"
			autocomplete="off"
			on:focus={() => {
				search(searchKeyword);
			}}
			bind:value={searchKeyword}
		/>
	</div>
</div>

<!-- result panel -->
<div
	id="result-panel"
	bind:this={resultPanel}
	class="max-h-[436px] overflow-y-scroll opacity-0 !absolute h-0 -right-3 w-[28rem] bg-card rounded-2xl top-20 transition-all"
>
	<div
		class="flex flex-col h-full onload-animation before:content-[''] before:pt-2 after:content-[''] after:pb-2"
	>
		{#each searchResult as item (item.url)}
			<a
				href={item.url}
				class="mx-2 py-2 px-3 rounded-xl result-item transition-all"
			>
				<div class="flex flex-row space-x-1 items-center">
					<p
						class="line-clamp-1 text-lg font-semibold text-foreground result-title"
					>
						{item.meta.title}
					</p>
					<span class="text-primary font-extrabold">
						<Icon icon="tabler:chevron-right" width={16} height={16} />
					</span>
				</div>
				<div>
					<div class="h-10">
						<p
							class="item-excerpt text-sm line-clamp-2 text-foreground-lighten"
						>
							{@html item.excerpt}
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
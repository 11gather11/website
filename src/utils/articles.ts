import { type CollectionEntry, getCollection } from 'astro:content'

/**
 * ナビゲーションリンク付きのソート済み記事一覧を取得
 *
 * @returns 公開日順（新→古）でソートされた記事配列。
 *          各記事に前後の記事ナビゲーションデータを追加
 *
 * @remarks
 * - 開発環境: 全記事表示（下書き含む）
 * - 本番環境: 公開記事のみ表示（下書き除外）
 * - 各記事に nextSlug/nextTitle（新しい記事）、prevSlug/prevTitle（古い記事）を追加
 */
export const getSortedArticles = async (): Promise<CollectionEntry<'articles'>[]> => {
	// 環境に基づいて記事をフィルタリングして取得
	const sortedArticles = (
		await getCollection('articles', ({ data }) => {
			// 本番環境では下書きを除外、開発環境では全て含む
			return import.meta.env.PROD ? !data.draft : true
		})
	).sort((a, b) => {
		// 公開日の降順でソート（新しい記事が先頭に来る）
		return b.data.published.valueOf() - a.data.published.valueOf()
	})

	// 各記事にナビゲーション情報（前後の記事へのリンク）を追加
	for (const [index, article] of sortedArticles.entries()) {
		// 前の記事（時系列的に新しい記事）へのリンク情報を設定
		if (index > 0) {
			const nextArticle = sortedArticles[index - 1]
			article.data.nextSlug = nextArticle.id
			article.data.nextTitle = nextArticle.data.title
		}

		// 次の記事（時系列的に古い記事）へのリンク情報を設定
		if (index < sortedArticles.length - 1) {
			const prevArticle = sortedArticles[index + 1]
			article.data.prevSlug = prevArticle.id
			article.data.prevTitle = prevArticle.data.title
		}
	}

	return sortedArticles
}

/**
 * アーカイブ記事の基本メタデータを表すインターフェース
 */
export interface Archive {
	/** 記事のタイトル */
	title: string
	/** 記事の一意識別子/スラグ */
	id: string
	/** 記事の公開日 */
	date: Date
	/** 記事に関連付けられたタグの配列（オプション） */
	tags?: string[]
}

/**
 * 年別にグループ化されたブログ記事アーカイブを取得・整理
 *
 * この関数は「articles」コレクションから全てのブログ記事を取得し、環境に基づいてフィルタリング
 * （本番環境では下書きを除外）し、公開年別にアーカイブを整理してマップに格納します。
 * 各アーカイブエントリには記事のタイトル、スラグ、公開日、タグが含まれます。
 * アーカイブは年度の降順、各年内では日付の降順でソートされます。
 *
 * @returns 年別にグループ化されたアーカイブのマップ（年数 -> Archive[]）を返すPromise
 */
export const getArchives = async (): Promise<Map<number, Archive[]>> => {
	// 環境ベースのフィルタリングで全ブログ記事を取得
	const allArticles = await getCollection('articles', ({ data }) => {
		// 本番環境では下書きを除外、開発環境では全記事を表示
		return import.meta.env.PROD ? !data.draft : true
	})

	// 記事の配列を年別のアーカイブMapに変換
	const archives = allArticles.reduce((archives, article) => {
		const publishedDate = new Date(article.data.published)
		const publishedYear = publishedDate.getFullYear()

		// 該当年がマップに存在しない場合は新しい配列を作成
		if (!archives.has(publishedYear)) {
			archives.set(publishedYear, [])
		}

		// アーカイブオブジェクトを作成して配列に追加
		archives.get(publishedYear)?.push({
			title: article.data.title,
			id: `/articles/${article.id}`,
			date: publishedDate,
			tags: article.data.tags,
		})

		return archives
	}, new Map<number, Archive[]>())

	// 年度の降順でソートし、各年内で日付の降順にソート
	return new Map(
		[...archives.entries()]
			.sort((a, b) => b[0] - a[0]) // 年度の降順ソート
			.map(([year, articles]) => [
				year,
				articles.sort((a, b) => (a.date > b.date ? -1 : 1)), // 各年内で日付の降順ソート
			])
	)
}

/**
 * コンテンツの分類に使用されるタグを表すインターフェース
 */
export interface Tag {
	/** タグの表示名 */
	name: string
	/** タグページのURLスラグ */
	slug: string
	/** このタグに関連付けられた記事の配列 */
	articles: Archive[]
}

/**
 * ブログ記事のタグを全て取得し、タグ別に記事をグループ化
 *
 * この関数は「articles」コレクションから全てのブログ記事を取得し、
 * 各記事のタグを抽出してタグごとのマップを作成します。
 * 各タグには関連する記事の一覧が含まれます。
 *
 * @returns タグのマップ（タグスラグ -> Tag オブジェクト）を返すPromise
 */
export const getTags = async (): Promise<Map<string, Tag>> => {
	// 環境ベースのフィルタリングで全ブログ記事を取得
	const allArticles = await getCollection('articles', ({ data }) => {
		// 本番環境では下書きを除外、開発環境では全記事を表示
		return import.meta.env.PROD ? !data.draft : true
	})

	// 記事の配列をタグのMapに変換
	return allArticles.reduce((tags, article) => {
		// 各記事のタグを処理
		for (const tagName of article.data.tags || []) {
			const tagSlug = tagName

			// 該当タグがマップに存在しない場合は新しいTagオブジェクトを作成
			if (!tags.has(tagSlug)) {
				tags.set(tagSlug, {
					name: tagName,
					slug: `/tags/${tagSlug}`,
					articles: [],
				})
			}

			// タグに記事を追加
			tags.get(tagSlug)?.articles.push({
				title: article.data.title,
				id: `/articles/${article.id}`,
				date: new Date(article.data.published),
				tags: article.data.tags,
			})
		}

		return tags
	}, new Map<string, Tag>())
}

/**
 * コンテンツのカテゴリを表すインターフェース
 */
export interface Category {
	/** カテゴリの表示名 */
	name: string
	/** カテゴリページのURLスラグ */
	slug: string
	/** このカテゴリ内の記事の配列 */
	articles: Archive[]
}

/**
 * ブログ記事のカテゴリを全て取得し、カテゴリ別に記事をグループ化
 *
 * この関数は「articles」コレクションから全てのブログ記事を取得し、
 * 環境に基づいてフィルタリング（本番環境では下書きを除外）を行います。
 * その後、記事をカテゴリ別に整理してマップとして返します。
 *
 * @returns カテゴリのマップ（カテゴリスラグ -> Category オブジェクト）を返すPromise
 */
export const getCategories = async (): Promise<Map<string, Category>> => {
	// 環境ベースのフィルタリングで全ブログ記事を取得
	const allArticles = await getCollection('articles', ({ data }) => {
		// 本番環境では下書きを除外、開発環境では全記事を表示
		return import.meta.env.PROD ? !data.draft : true
	})

	// 記事の配列をカテゴリのMapに変換
	return allArticles.reduce((categories, article) => {
		// カテゴリが設定されていない記事はスキップ
		if (!article.data.category) return categories

		const categorySlug = article.data.category

		// 該当カテゴリがマップに存在しない場合は新しいCategoryオブジェクトを作成
		if (!categories.has(categorySlug)) {
			categories.set(categorySlug, {
				name: article.data.category,
				slug: `/categories/${categorySlug}`,
				articles: [],
			})
		}

		// カテゴリに記事を追加
		categories.get(categorySlug)?.articles.push({
			title: article.data.title,
			id: `/articles/${article.id}`,
			date: new Date(article.data.published),
			tags: article.data.tags,
		})

		return categories
	}, new Map<string, Category>())
}

/**
 * 記事を公開年別にグループ化してマップに整理
 *
 * この関数は記事の配列を受け取り、各記事の公開年をキーとして
 * 年別にグループ化されたマップを作成します。
 * 同じ年に公開された記事は配列として格納されます。
 *
 * @param articles - グループ化する記事の配列
 * @returns 年別にグループ化された記事のマップ（年数 -> Archive[]）
 */
export const groupArticlesByYear = (articles: Archive[]) => {
	return articles.reduce((archiveMap, article) => {
		const year = article.date.getFullYear()

		// 該当年がマップに存在しない場合は新しい配列を作成
		if (!archiveMap.has(year)) {
			archiveMap.set(year, [])
		}

		// 年別グループに記事を追加
		archiveMap.get(year)?.push(article)
		return archiveMap
	}, new Map<number, Archive[]>())
}

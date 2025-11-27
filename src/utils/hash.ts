import CryptoJS from 'crypto-js'

import { siteConfig } from '@/config/site'

/**
 * スラグをサイト設定に基づいてハッシュ化または生のまま返す
 *
 * この関数はサイト設定の slugMode に応じて：
 * - "HASH": SHA256でハッシュ化して指定文字数の16進文字列を返す
 * - "RAW": 入力されたスラグをそのまま返す
 *
 * @param slug - 変換対象のスラグ文字列
 * @param length - ハッシュ文字列の長さ（デフォルト: siteConfig.slugLength）
 * @returns ハッシュ化されたスラグまたは元のスラグ
 * @throws 入力が空文字列の場合、または長さが無効な場合はエラー
 *
 * @example
 * ```typescript
 * // HASH モードの場合（デフォルト長）
 * idToSlug("hello-world") // "a665a45920422f9d" (設定による)
 *
 * // HASH モードの場合（カスタム長）
 * idToSlug("hello-world", 8) // "a665a459"
 *
 * // RAW モードの場合（長さは無視される）
 * idToSlug("hello-world") // "hello-world"
 * ```
 */
export const idToSlug = (
	slug: string,
	length = siteConfig.slugLength
): string => {
	if (!slug.trim()) {
		throw new Error('Slug cannot be empty')
	}

	// HASHモードの場合のみ長さをバリデーション
	if (siteConfig.slugMode === 'HASH') {
		if (!Number.isInteger(length) || length <= 0 || length > 64) {
			throw new Error('Length must be a positive integer between 1 and 64')
		}
	}

	switch (siteConfig.slugMode) {
		case 'HASH': {
			const hash = CryptoJS.SHA256(slug)
			const hashedSlug = hash.toString(CryptoJS.enc.Hex).slice(0, length)
			return hashedSlug
		}
		case 'RAW':
			return slug
		default:
			// 未知の設定値の場合はRAWとして扱う
			console.warn(`Unknown slugMode: ${siteConfig.slugMode}. Using RAW mode.`)
			return slug
	}
}

/**
 * スラグIDから配列インデックスを計算するハッシュ関数
 *
 * この関数は文字列から一様分布に近いハッシュ値を生成し、
 * 指定された配列長の範囲内のインデックスを返します。
 * 同じ入力に対しては常に同じインデックスが返されます。
 *
 * アルゴリズム：
 * - 各文字のASCII値に31の累乗を掛けて累積
 * - オーバーフロー防止のためメルセンヌ素数で剰余演算
 * - 最終的に配列長で剰余を取ってインデックス化
 *
 * @param id - ハッシュ化するスラグID文字列
 * @param listLength - 対象配列の長さ
 * @returns 0から(listLength-1)の範囲のインデックス
 * @throws 配列長が0以下の場合はエラー
 *
 * @example
 * ```typescript
 * getIndexFromSlugID("article-1", 5) // 0-4のいずれかの値
 * getIndexFromSlugID("article-1", 10) // 0-9のいずれかの値
 * ```
 */
export const getIndexFromSlugID = (id: string, listLength: number): number => {
	if (listLength <= 0) {
		throw new Error('List length must be greater than 0')
	}

	if (!id) {
		throw new Error('ID cannot be empty')
	}

	// ハッシュ値を計算
	let hashValue = 0
	const PRIME = 31
	const MOD = 2147483647 // 2^31 - 1 (メルセンヌ素数)

	for (let i = 0; i < id.length; i++) {
		hashValue = (hashValue * PRIME + id.charCodeAt(i)) % MOD
	}

	// 配列長で剰余を取ってインデックスを取得
	return hashValue % listLength
}

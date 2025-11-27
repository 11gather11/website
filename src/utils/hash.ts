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

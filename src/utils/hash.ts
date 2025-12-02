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

import pokedex from '../constans/pokedex.json'
const INCREASE = 35

// ポケモンをid順で並び替え
const sortPokemonList = (list) => {
  list.sort((a, b) => {
    if (a.id > b.id) return 1
    if (a.id < b.id) return -1
    return 0
  })

  return list
}

// タイプに一致するポケモンを抽出する
export const filteringTypes = (data) => {
  // タイプに一致するポケモンを配列に入れる
  // 重複する可能性があるので、とりあえず仮データとして扱う
  const ids = []
  const payload = pokedex.reduce((acc, value) => {
    data.forEach(type => {
      if (value.type.includes(type) && !ids.includes(value.id)) {
        ids.push(value.id)
        acc.push(value)
      }
    })
    return acc
  }, [])

  return payload
}

// シリーズに一致するポケモンを抽出する
export const filteringSeries = (data) => {
  // dataは'1-151'のような形式で渡ってくるので、'-'で区切る
  const splitId = data.split('-')

  // splitId[0]を開始点、splitId[1]を終了点とする
  const start = Number(splitId[0]) - 1
  const end = Number(splitId[1])

  // pokedexからstart〜endの配列を抜き取って返す
  return pokedex.slice(start, end)
}

// お気に入りidに一致するポケモンを抽出する
export const filteringFavorites = (data) => {
  const payload = pokedex.filter(pokemon => data.includes(pokemon.id))

  // id順にソートしたデータを返す
  return sortPokemonList(payload)
}

// 絞り込みかけられたdataからinfiniteScroll稼働の可否を精査
export const checkFilteredData = (data) => {
  const payload = {
    hasMore: false,
    zukan: data
  }

  // データ件数が35件超えてるかを判別
  if (data.length > INCREASE) {
    payload.hasMore = true
    payload.zukan = data.slice(0, INCREASE)
  }

  return payload
}

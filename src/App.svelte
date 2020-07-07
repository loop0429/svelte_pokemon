<script>
import Tailwindcss from './Tailwindcss.svelte'

import Header from './components/Header.svelte'
import Zukan from './components/Zukan.svelte'
import Modal from './components/Modal.svelte'
import Sidebar from './components/Sidebar.svelte'
import {
  filteringTypes,
  filteringSeries,
  filteringFavorites,
  checkFilteredData
} from './utils/filterUtils.js'

import pokedex from './constans/pokedex.json'
import weakResistDex from './constans/weak_resist.json'

let isOpenModal = false
let isOpenSidebar = false
let modalType = ''
let weakResist = {}
let selectedTypes = []
let selectedSeries = ''
let filterdZukan = []
let favoritesPokemon = []
let rowZukan = pokedex
let hasMore = true
let page = 1
const INCREASE = 35

// init
const init = () => {
  filterdZukan = pokedex.slice(0, INCREASE)
  // ローカルストレーシのお気に入りポケモンidを取得
  if (JSON.parse(localStorage.getItem('pkmzfavorite'))) {
    favoritesPokemon = JSON.parse(localStorage.getItem('pkmzfavorite'))
  }
}

init()

// お気に入り追加
const toggleFavorites = (e) => {
  const id = e.detail.id
  let favorites = favoritesPokemon.slice()

  // favoritesPokemonにすでに同一のidが含まれているなら、そのidを除外。そうでなければidを追加。
  if (favorites.includes(id)) {
    favorites = favoritesPokemon.filter(pokemon => {
      return pokemon !== id
    })
  } else {
    favorites.push(id)
  }

  favoritesPokemon = favorites

  // ローカルストレージのお気に入りリストを更新
  localStorage.setItem('pkmzfavorite', JSON.stringify(favoritesPokemon))
}

// モーダルの表示
const toggleModal = (e) => {
  isOpenModal = !isOpenModal

  const detail = e.detail

  // モーダルに表示するコンテンツの出しわけ
  modalType = detail.type

  if (!detail.id) return
  // 弱点耐性のオブジェクトを作ってもらう
  weakResist = calcWeakRegist(detail.id)
}

// 弱点耐性の計算
const calcWeakRegist = (id) => {
  // pokedexから該当のポケモンを取得
  const targetPokemon = pokedex.find(pokemon => pokemon.id === id)
  const types = targetPokemon.type
  const wsData = {}

  // タイプの数だけ回す
  types.forEach(type => {
    // weakResistDexから弱点・耐性のデータを取得
    const typeData = weakResistDex[type]

    // すでにwsDataに登録されていたら、登録されているものを±して計算
    // 弱点
    typeData.weak.forEach(weak => {
      wsData[weak] = wsData[weak] ? wsData[weak] + 1 : 1
    })

    // 耐性
    typeData.resistance.forEach(resist => {
      wsData[resist] = wsData[resist] ? wsData[resist] - 1 : -1
    })

    // 無効※ポケGoでは二重耐性
    typeData.no_effect.forEach(noEffect => {
      wsData[noEffect] = wsData[noEffect] ? wsData[noEffect] - 2 : -2
    })
  })

  // 先に型を用意
  const payload = {
    weak2: {
      name: '二重弱点',
      types: []
    },
    weak1: {
      name: '弱点',
      types: []
    },
    resist1: {
      name: '耐性',
      types: []
    },
    resist2: {
      name: '二重耐性',
      types: []
    },
    resist3: {
      name: '三重耐性',
      types: []
    }
  }

  // wsDataに登録されてる内容から弱点耐性の振り分け
  Object.keys(wsData).forEach(type => {
    // タイプの画像ファイルと日本語名
    const data = {
      type: weakResistDex[type].ja,
      img: `/img/icon/type-${type}.png`
    }

    let target = null

    switch (wsData[type]) {
      // 二重弱点
      case 2:
        target = payload.weak2.types
        break
      // 弱点
      case 1:
        target = payload.weak1.types
        break
      // 耐性
      case -1:
        target = payload.resist1.types
        break
      // 二重耐性
      case -2:
        target = payload.resist2.types
        break
      // 三重耐性
      case -3:
        target = payload.resist3.types
        break
    }

    if (target) {
      target.push(data)
    }
  })

  return payload
}

// サイドバーのトグル
const toggleSidebar = () => {
  isOpenSidebar = !isOpenSidebar
}

// 絞り込み
const toggleFilter = (e) => {
  const detail = e.detail
  const actionType = detail.type
  const data = detail.data

  // タイプで絞り込み
  if (actionType === 'type') {
    selectedSeries = ''

    // selectedTypesにすでに同一のtypeが含まれているなら、そのtypeを除外。そうでなければtypeを追加。
    let types = selectedTypes.slice()
    if (types.includes(data)) {
      types = selectedTypes.filter(type => type !== data)
    } else {
      types.push(data)
    }

    selectedTypes = types

    // typesが空でなければtypesから一致するポケモンデータを返してもらう。空ならpokedexの全データを使用する。
    rowZukan = types.length > 0 ? filteringTypes(types) : pokedex
  }

  // シリーズで絞り込み
  if (actionType === 'series') {
    selectedTypes = []
    selectedSeries = data

    // 選択したシリーズから一致するポケモンデータを返してもらう
    rowZukan = filteringSeries(selectedSeries)
  }

  // お気に入りで絞り込み
  if (actionType === 'favorite') {
    selectedTypes = []
    selectedSeries = data

    // お気に入りのポケモンがいなければ
    if (!favoritesPokemon.length) {
      alert('お気に入りのポケモンがいません')
      return
    }

    // お気に入り登録されているidから一致するポケモンデータを返してもらう
    rowZukan = filteringFavorites(favoritesPokemon)
  }

  // 選択をクリア
  if (actionType === 'clear') {
    selectedTypes = []
    selectedSeries = ''

    rowZukan = pokedex
  }

  // inifite scroll対応
  const payload = checkFilteredData(rowZukan)
  page = 1
  filterdZukan = payload.zukan
  hasMore = payload.hasMore
}

// infiniteScroll
const updatePage = () => {
  page = page + 1
  let end = page * INCREASE
  hasMore = true

  // rowZukanの件数を超えたら、infinite scrollを停止させる
  if (end > rowZukan.length) {
    end = rowZukan.length
    hasMore = false
  }

  filterdZukan = rowZukan.slice(0, end)
}
</script>

<Tailwindcss />

<div>
  <Header
    on:modal={toggleModal}
    on:sidebar={toggleSidebar}
  />
  <Zukan
    filterdZukan={filterdZukan}
    favoritesPokemon={favoritesPokemon}
    hasMore={hasMore}
    on:modal={toggleModal}
    on:favorite={toggleFavorites}
    on:more={updatePage}
  />
  <Sidebar
    isOpen={isOpenSidebar}
    selectedTypes={selectedTypes}
    selectedSeries={selectedSeries}
    on:sidebar={toggleSidebar}
    on:filter={toggleFilter}
  />
  <Modal
    isOpen={isOpenModal}
    modalType={modalType}
    weakResist={weakResist}
    on:modal={toggleModal}
  />
</div>

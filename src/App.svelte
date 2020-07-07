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
import { calcWeakRegist } from './utils/calcUtils.js'

import pokedex from './constans/pokedex.json'

let isOpenModal = false
let isOpenSidebar = false
let modalType = ''
let weakResist = {}
let selectedTypes = []
let selectedSeries = ''
let favoritesPokemon = []
let rowZukan = pokedex
let filterdZukan = []
let page = 1
let hasMore = true

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
    favorites = favoritesPokemon.filter(pokemon => pokemon !== id)
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
    selectedSeries = data

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

<div class="bg-white">
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

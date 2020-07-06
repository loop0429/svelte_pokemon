<script>
import Tailwindcss from './Tailwindcss.svelte'

import Header from './components/Header.svelte'
import Zukan from './components/Zukan.svelte'
import Modal from './components/Modal.svelte'
import Sidebar from './components/Sidebar.svelte'

import pokedex from './constans/pokedex.json'
import weakResistDex from './constans/weak_resist.json'

let isOpenModal = false
let isOpenSidebar = false
let modalType = ''
let weakResist = {}
let selectedTypes = []
let selectedSeries = ''
let filterdZukan = []

// init
filterdZukan = pokedex

const toggleModal = (e) => {
  isOpenModal = !isOpenModal

  const payload = e.detail
  modalType = payload.type

  if (!payload.id) return
  // 弱点耐性のオブジェクトを作ってもらう
  weakResist = calcWeakRegist(payload.id)
}

// 弱点耐性の計算
const calcWeakRegist = (id) => {
  // pokedexから該当のポケモンを取得
  const pokemonData = pokedex.find((pokemon) => {
    return pokemon.id === id
  })

  const types = pokemonData.type
  const wsData = {}

  // タイプの数だけ回す
  types.forEach((type) => {
    // weakResistDexから弱点・耐性のデータを取得
    const typeData = weakResistDex[type]

    // すでにwsDataに登録されていたら、登録されているものを±して計算
    // 弱点
    typeData.weak.forEach((weak) => {
      wsData[weak] = (wsData[weak]) ? wsData[weak] + 1 : 1
    })

    // 耐性
    typeData.resistance.forEach((resist) => {
      wsData[resist] = (wsData[resist]) ? wsData[resist] - 1 : -1
    })

    // 無効※ポケGoでは二重耐性
    typeData.no_effect.forEach((noEffect) => {
      wsData[noEffect] = (wsData[noEffect]) ? wsData[noEffect] - 2 : -2
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
  Object.keys(wsData).forEach((type) => {
    // タイプの画像ファイルと日本語名
    const data = {
      type: weakResistDex[type].ja,
      img: `/img/icon/type-${type}.png`
    }

    switch (wsData[type]) {
      // 二重弱点
      case 2:
        payload.weak2.types.push(data)
        break
      // 弱点
      case 1:
        payload.weak1.types.push(data)
        break
      // 耐性
      case -1:
        payload.resist1.types.push(data)
        break
      // 二重耐性
      case -2:
        payload.resist2.types.push(data)
        break
      // 三重耐性
      case -3:
        payload.resist3.types.push(data)
        break
    }
  })

  return payload
}

const toggleSidebar = () => {
  isOpenSidebar = !isOpenSidebar
}

// 絞り込み
const toggleFilter = (e) => {
  const payload = e.detail
  const data = payload.data

  // タイプで絞り込み
  if (payload.type === 'type') {
    selectedSeries = ''

    // selectedTypesにすでに同一のtypeが含まれているなら、そのtypeを除外。そうでなければtypeを追加。
    let types = selectedTypes.slice()
    if (types.includes(data)) {
      types = selectedTypes.filter(type => {
        return type !== data
      })
    } else {
      types.push(data)
    }

    selectedTypes = types

    // typesが空でなければtypesから一致するポケモンデータを返してもらう。空ならpokedexの全データを使用する。
    filterdZukan = types.length > 0 ? filteringTypes(types) : pokedex
  }

  // シリーズで絞り込み
  if (payload.type === 'series') {
    selectedTypes = []
    selectedSeries = data

    filterdZukan = filteringSeries(selectedSeries)
  }

  // 選択をクリア
  if (payload.type === 'clear') {
    selectedTypes = []
    selectedSeries = ''
  }
}

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
const filteringTypes = (data) => {
  // タイプに一致するポケモンを配列に入れる
  // 重複する可能性があるので、とりあえず仮データとして扱う
  const dummyData = []
  data.forEach(type => {
    pokedex.forEach(pokemon => {
      if (pokemon.type.includes(type)) {
        dummyData.push(pokemon)
      }
    })
  })

  // 重複するデータを削除
  const payload = dummyData.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  // id順にソートしたデータを返す
  return sortPokemonList(payload)
}

// シリーズに一致するポケモンを抽出する
const filteringSeries = (data) => {
  // dataは'1-151'のような形式で渡ってくるので、'-'で区切る
  const splitId = data.split('-')

  // splitId[0]を開始点、splitId[1]を終了点とする
  const start = Number(splitId[0]) - 1
  const end = Number(splitId[1])

  // pokedexからstart〜endの配列を抜き取って返す
  return pokedex.slice(start, end)
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
    on:modal={toggleModal}
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

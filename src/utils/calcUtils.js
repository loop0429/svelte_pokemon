import pokedex from '../constans/pokedex.json'
import weakResistDex from '../constans/weak_resist.json'

// 弱点耐性の計算
export const calcWeakRegist = (id) => {
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

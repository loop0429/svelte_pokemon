<script>
import { slide } from 'svelte/transition'

import { TYPES } from '../constans/types'
import { SERIES } from '../constans/series'

export let isOpen

let collapseTarget = ''
const collapseParams = {
  duration: 700
}

// Collapse
const handleClickCollapse = (str) => {
  // もし押下したコンテンツが現状開いてるなら閉じるために空文字を入れる
  const target = str === collapseTarget ? '' : str
  collapseTarget = target
}
</script>

<div class="sidebar" class:is-open="{isOpen}">
  <div class="sidebar__overlay" />
  <div class="sidebar__wrapper">
    <dl class="m-0">
      <dt class="p-2 bg-gray-200">絞り込み検索</dt>
      <dd class="text-sm">
        <button
          class="block w-full p-2 bg-blue-600 text-white text-left btn-filter"
          type="button"
        >
          お気に入りポケモンで絞り込み
        </button>
      </dd>
      <dd class="text-sm">
        <button
          class="block w-full p-2 bg-blue-600 text-white text-left btn-filter"
          type="button"
          on:click={() => handleClickCollapse('types')}
        >
          タイプで絞り込み
        </button>
        {#if collapseTarget === 'types'}
          <ul class="filter-child__list" transition:slide={collapseParams}>
            {#each TYPES as item}
            <li class="filter-child__item">
              <button
                class="relative w-full filter-child__btn"
                type="button"
              >
                <div class="relative flex items-center p-2 z-10">
                  <img
                    class="mr-1"
                    src={`/img/icon/type-${item.en}.png`}
                    width="15"
                    alt=""
                  />
                  {item.ja}
                </div>
              </button>
            </li>
            {/each}
            <li>
              <button
                class="w-full p-2 bg-gray-200 text-left btn-clear-filter"
                type="button"
              >
                選択をクリア
              </button>
            </li>
          </ul>
        {/if}
      </dd>
      <dd class="text-sm">
        <button
          class="block w-full p-2 bg-blue-600 text-white text-left btn-filter"
          type="button"
          on:click={() => handleClickCollapse('series')}
        >
          シリーズで絞り込み
        </button>
        {#if collapseTarget === 'series'}
          <ul class="filter-child__list" transition:slide={collapseParams}>
            {#each SERIES as item}
            <li class="filter-child__item">
              <button
                class="relative w-full filter-child__btn"
                type="button"
              >
                <div class="relative flex items-center p-2 z-10">{item.area}</div>
              </button>
            </li>
            {/each}
            <li>
              <button
                class="w-full p-2 bg-gray-200 text-left btn-clear-filter"
                type="button"
              >
                選択をクリア
              </button>
            </li>
          </ul>
        {/if}
    </dl>
  </div>
</div>

<style>
.sidebar__wrapper {
  position: fixed;
  left: -250px;
  top: 0;
  overflow-y: scroll;
  width: 250px;
  height: 100%;
  background: #FFF;
  transition: all 0.3s ease-in-out;
  z-index: 50;
}

.sidebar__overlay {
  position: fixed;
  top: 0;
  display: none;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  transition: all 0.3s ease-in-out;
  z-index: 49;
}

.sidebar.is-open .sidebar__wrapper {
  transform: translateX(250px);
}

.sidebar.is-open .sidebar__overlay {
  display: block;
  background: rgba(0, 0, 0, .5);
}

.filter-child__item {
  border-bottom: 1px solid #e2e8f0;
}

.filter-child__btn:after {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  background: #edf2f7;
  content: "";
  z-index: 9;
  transition: width 0.2s ease-in-out;
}

.filter-child__btn:hover:after {
  width: 100%;
}

.filter-child__btn:focus {
  outline: none;
}

.btn-filter {
  margin-bottom: 1px;
  transition: opacity 0.2s ease-in-out;
}

.btn-filter:hover {
  opacity: 0.7;
}

.btn-filter:focus {
  outline: none;
}

.btn-clear-filter {
  transition: opacity 0.2s ease-in-out;
}

.btn-clear-filter:hover {
  opacity: 0.7;
}

.btn-clear-filter:focus {
  outline: none;
}
</style>

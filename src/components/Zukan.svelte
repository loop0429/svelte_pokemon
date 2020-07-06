<script>
import { createEventDispatcher } from 'svelte'
import Icon from 'svelte-awesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'

export let filterdZukan
export let favoritesPokemon

const dispatch = createEventDispatcher()

const handlePokemonClick = (id) => {
  dispatch('modal', {
    type: 'weakResist',
    id
  })
}

const handleFavoriteClick = (id) => {
  dispatch('favorite', { id })
}
</script>

<div class="max-w-5xl mx-auto px-3 sm:px-0">
  <ul class="flex flex-wrap justify-between sm:justify-start pt-20 sm:pt-24 zukan__list">
    {#each filterdZukan as item}
    <li class="mb-3 zukan__item">
      <div class="sm:mx-2 shadow-md">
        <div class="flex justify-end pt-2 pr-2">
          <button
            class="leading-none btn-favorite"
            type="button"
            on:click={() => handleFavoriteClick(item.id)}
          >
            <Icon
              class="text-pink-400"
              data={favoritesPokemon.includes(item.id) ? faHeart : farHeart}
            />
          </button>
        </div>
        <div class="pb-1 sm:pb-2 cursor-pointer text-center zukan__btn" on:click={() => handlePokemonClick(item.id)}>
          <div class={`mx-auto icon-${item.id}MS`} />
          <span class="inline-block text-xs">{`No.${item.id}`}</span>
          <ul class="inline-block">
            {#each item.type as types}
            <li class="inline-block ml-1">
              <img src={`/img/icon/type-${types}.png`} width="15" alt="" />
            </li>
            {/each}
          </ul>
          <span class="block text-sm">{item.name.japanese}</span>
          <span class="block text-gray-400 text-xs">{item.name.english}</span>
        </div>
      </div>
    </li>
    {/each}
  </ul>
</div>

<style>
.zukan__item {
  width: 31%;
}

@media (min-width: 640px) {
  .zukan__item {
    width: 20%;
  }
}

.zukan__btn {
  transition: opacity 0.2s ease-in-out;
}

.zukan__btn:hover {
  opacity: 0.7;
}

.btn-favorite:focus {
  outline: none;
}
</style>

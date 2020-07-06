<script>
import { createEventDispatcher } from 'svelte'
import Icon from 'svelte-awesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

const dispatch = createEventDispatcher()

// 右上のフィーチャーボタン押下時
const handleClickModalButton = () => {
  dispatch('modal', {
    type: 'feature'
  })
}

// 左上のメニューボタン押下時
const handleClickSidebarButton = () => {
  dispatch('sidebar')
}
</script>

<header class="fixed w-full bg-white shadow-md z-10">
  <div class="flex justify-between items-center max-w-5xl mx-auto px-2 py-3">
    <button
      class="btn-header"
      type="button"
      on:click={handleClickSidebarButton}
    >
      <Icon data={faBars} scale="2" />
    </button>
    <h1 class="text-2xl lg:text-4xl font-semibold text-center">ポケモンGO図鑑</h1>
    <button
      class="btn-header"
      type="button"
      on:click={handleClickModalButton}
    >
      <Icon data={faQuestionCircle} scale="2" />
    </button>
  </div>
</header>

<style>
.btn-header:focus {
  outline: none;
}
</style>

<script>
import Icon from 'svelte-awesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
</script>

<header class="fixed w-full bg-white shadow-md z-10">
  <div class="flex justify-between items-center max-w-5xl mx-auto px-2 py-3">
    <button
      class="btn-header"
      type="button"
    >
      <Icon data={faBars} scale="2" />
    </button>
    <h1 class="text-2xl lg:text-4xl font-semibold text-center">ポケモンGO図鑑</h1>
    <button
      class="btn-header"
      type="button"
    >
      <Icon data={faQuestionCircle} scale="2" />
    </button>
  </div>
</header>

<style lang="scss">
.btn-header:focus {
  outline: none;
}
</style>

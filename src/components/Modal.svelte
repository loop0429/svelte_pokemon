<script>
import { createEventDispatcher } from 'svelte'

import Feature from './modal/Feature.svelte'
import WeakResist from './modal/WeakResist.svelte'

export let isOpen
export let modalType
export let weakResist

const dispatch = createEventDispatcher()

const handleOverlayClick = () => {
  dispatch('modal', {
    type: ''
  })
}
</script>

<div class="modal" class:is-open="{isOpen}">
  <div class="modal__overlay" on:click={handleOverlayClick} />
  <div class="modal__content">
    {#if modalType === 'feature'}
      <Feature />
    {/if}
    {#if modalType === 'weakResist'}
      <WeakResist weakResist={weakResist} />
    {/if}
  </div>
</div>

<style>
.modal {
  display: none;
  height: 100vh;
}

.modal__overlay {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  transition: all 0.5s;
  z-index: 49;
}

.modal__content {
  position: fixed;
  left: 50%;
  top: 50%;
  margin: auto;
  padding: 15px;
  overflow-y: scroll;
  max-width: 500px;
  width: 85%;
  max-height: 90vh;
  background: #FFF;
  border-radius: 8px;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: all 0.5s;
  z-index: 50;
}

.modal.is-open {
  position: fixed;
  display: block;
  z-index: 4;
}

.modal.is-open .modal__overlay {
  background: rgba(0, 0, 0, 0.5);
}

.modal.is-open .modal__content {
  opacity: 1;
}
</style>

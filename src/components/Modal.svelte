<script>
import Feature from './modal/Feature.svelte'

export let isOpen
</script>

<div class="modal" class:is-open="{isOpen}">
  <div class="modal__overlay" />
  <div class="modal__content">
    <Feature />
  </div>
</div>

<style lang="scss">
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

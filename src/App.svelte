<script>
import Tailwindcss from './Tailwindcss.svelte'

import Header from './components/Header.svelte'
import Modal from './components/Modal.svelte'

let isOpen = false

const toggleModal = () => {
  isOpen = !isOpen
}
</script>

<Tailwindcss />

<div>
  <Header on:modal={toggleModal} />
  <Modal isOpen={isOpen} />
</div>

<script>
import Tailwindcss from './Tailwindcss.svelte'

import Header from './components/Header.svelte'
import Zukan from './components/Zukan.svelte'
import Modal from './components/Modal.svelte'
import Sidebar from './components/Sidebar.svelte'

import pokedex from './constans/pokedex.json'

let isOpenModal = false
let isOpenSidebar = false

const toggleModal = () => {
  isOpenModal = !isOpenModal
}

const toggleSidebar = () => {
  isOpenSidebar = !isOpenSidebar
}
</script>

<Tailwindcss />

<div>
  <Header
    on:modal={toggleModal}
    on:sidebar={toggleSidebar}
  />
  <Zukan filterdZukan={pokedex} />
  <Sidebar isOpen={isOpenSidebar} />
  <Modal isOpen={isOpenModal} />
</div>

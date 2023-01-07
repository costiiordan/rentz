<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <b-icon icon="cards" class="mr-3" />
          Rentz score
        </a>
      </div>
    </nav>

    <section class="main-content columns">
      <div class="container column is-12">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'DefaultLayout',
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Set players',
          icon: 'lightbulb',
          to: { name: 'set-players' }
        },
        {
          title: 'Game',
          icon: 'lightbulb',
          to: { name: 'game' }
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      initGame: "game/initGame"
    })
  }
}
</script>

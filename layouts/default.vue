<template>
  <div class="layout-container">
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <NuxtLink to="/"  class="navbar-item">
          <b-icon icon="cards" class="mr-3" />
          Rentz Score
        </NuxtLink>
      </div>
    </nav>

    <section class="main-content columns">
      <div class="container column is-12">
        <Nuxt />
      </div>
    </section>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Rentz Score</strong> by <a href="https://constantiniordan.ro">Constantin Iordan</a>. The source code is open source.
        </p>
      </div>
    </footer>
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

<style>
  .layout-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex-grow: 1;
  }
</style>

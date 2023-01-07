<template>
  <section class="section">
    <div class="columns is-mobile">
      <card title="Joc nou" icon="cards">
        <b-button type="is-primary" @click="newGame()">Joc nou</b-button>
      </card>
      <card title="Continua joc" icon="cards-club">
        <b-button type="is-primary" :disabled="!players.length" tag="router-link" to="/game">Continua joc</b-button>
      </card>
    </div>
  </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'IndexPage',
  computed: {
    ...mapGetters({
      players: "game/getPlayers"
    })
  },
  methods: {
    ...mapActions({
      restartGame: "game/restartGame"
    }),
    newGame() {
      this.restartGame();

      this.$router.push({path: "/set-players"})
    }
  }
}
</script>

<template>
  <section class="section">
    <div class="block">
      <b-radio name="playersCount" v-model="playersCount" :native-value="4" :disabled="isOngoingGame">
        4 jucatori
      </b-radio>
      <b-radio name="playersCount" v-model="playersCount" :native-value="6" :disabled="isOngoingGame">
        6 jucatori
      </b-radio>
    </div>
    <b-field
        v-for="(player, index) in players"
        :key="index"
        v-if="index < playersCount"
        :label="playerLabel(index)"
        :type="player.isValid ? '' : 'is-danger'">
      <b-input v-model="player.name" @keyup.native="validateField(index)"></b-input>
    </b-field>

    <b-button type="is-primary" @click="save()" :disabled="!canSave">Salveaza</b-button>

    <b-button v-if="isOngoingGame" tag="router-link" to="/game">Inapoi</b-button>
  </section>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  data() {
    return {
      playersCount: 6,
      players: []
    };
  },
  computed: {
    canSave() {
      return this.players
          .slice(0, this.playersCount)
          .reduce((canSave, player) => canSave && (player.touched && player.isValid), true);
    },
    ...mapGetters({
      isOngoingGame: 'game/isOngoingGame',
      existingPlayers: "game/getPlayers"
    })
  },
  created() {
    const players = [];

    for(let i = 0; i < this.playersCount; i++) {
      players.push(this.existingPlayers[i] ?? '');
    }

    this.players = players.map(player => {
      return {name: player, isValid: true, touched: !!player.length}
    });

    this.playersCount = this.existingPlayers.length === 0 ? players.length : this.existingPlayers.length;
  },
  methods: {
    ...mapMutations({
      savePlayers: 'game/setPlayers'
    }),
    ...mapActions({
      savePlayers: 'game/savePlayers'
    }),

    playerLabel(index) {
      return 'Jucator ' + (index + 1).toString();
    },

    validateField(index) {
      if (this.players[index].touched) {
        this.players[index].isValid = this.players[index].name.length > 0;

        return;
      }

      this.players[index].touched = true;
    },

    save() {
      const players = this.players
          .splice(0, this.playersCount)
          .map(player => player.name);

      this.savePlayers(players);

      this.$router.push('/game');
    }
  }
}
</script>

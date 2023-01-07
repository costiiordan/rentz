<template>
  <section class="section">
    <div
      v-for="(player, playerIndex) in players"
      :key="'players'+playerIndex"
      class="mb-4"
    >
      <div class="mb-2 is-size-5 has-text-weight-bold">{{ player }}</div>
      <div class="block">
        <b-checkbox
          v-for="(order, orderIndex) in players"
          :key="'order'+orderIndex+'player'+playerIndex"
          v-model="finishOrderMatrix[playerIndex][orderIndex]"
          :name="'player'+playerIndex"
          :disabled="isOptionDisabled(playerIndex, orderIndex)"
          :native-value="orderIndex"
        >{{ orderIndex + 1 }}</b-checkbox>
      </div>
    </div>

    <b-button type="is-primary" @click="save()" :disabled="!canSave">Salveaza</b-button>

    <b-button tag="router-link" to="/game">Inapoi</b-button>
  </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'PositiveSubGame',
  data() {
    return {
      finishOrderMatrix: [],
      subGameTypeKey: null
    }
  },
  computed: {
    ...mapGetters({
      players: "game/getPlayers",
      rentzGame: "game/getRentzGame",
      playerTurnIndex: "game/getPlayerTurnIndex",
    }),

    canSave() {
      return this.finishOrder.indexOf(null) === -1;
    },

    finishOrder() {
      return this.finishOrderMatrix
          .map(playerFinishOrder => playerFinishOrder.indexOf(true))
          .map(value => value === -1 ? null : value);
    }
  },
  created() {
    this.finishOrderMatrix = this.players.map(() => this.players.map(() => false));
    this.subGameTypeKey = this.$router.currentRoute.query.game;
  },
  methods: {
    ...mapActions({saveGameRound: "game/saveGameRound"}),

    save() {
      if (!this.canSave) {
        return;
      }

      const gameRound = {
        playerIndex: this.playerTurnIndex,
        subGameType: this.subGameTypeKey,
        playerSubGameResults: this.players.map((player, index) => {
          return {
            playerIndex: index,
            rentzDirect: this.subGameTypeKey === 'rentzDirect' ? this.subGameTypeKey : null,
            rentzIndirect: this.subGameTypeKey === 'rentzIndirect' ? this.subGameTypeKey : null,
            dame: null,
            carouri: null,
            levate: null,
            popa: null,
            points: this.rentzGame.calculatePoints(this.subGameTypeKey, this.finishOrder[index])
          }
        })
      };

      this.saveGameRound(gameRound);

      this.$router.push('/game');
    },

    isOptionDisabled(playerIndex, orderIndex) {
      if (this.finishOrderMatrix[playerIndex][orderIndex]) {
        return false;
      }

      for (let i = 0; i < this.finishOrderMatrix.length; i++) {
        if (this.finishOrderMatrix[i][orderIndex]) {
          return true;
        }
        if (this.finishOrderMatrix[playerIndex][i]) {
          return true;
        }
      }

      return false;
    },
  }
}
</script>

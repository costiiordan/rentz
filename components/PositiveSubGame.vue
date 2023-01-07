<template>
  <section class="section">
    <div
      v-for="(player, playerIndex) in players"
      :key="'players'+playerIndex"
      class="mb-4"
    >
      <div class="mb-2">{{ player }}</div>
      <div class="block">
        <b-button
          v-for="(order, orderIndex) in players"
          :key="'order'+orderIndex+'player'+playerIndex"
          :type="finishOrderMatrix[playerIndex][orderIndex] ? 'is-success' : 'is-primary'"
          @click="setFinishOrder(playerIndex,orderIndex)"
          :disabled="isOptionDisabled(playerIndex, orderIndex)"
          class="mr-3">
          {{ orderIndex + 1 }}
        </b-button>
      </div>
    </div>

    <div class="buttons mt-5">
      <b-button type="is-primary" @click="save()" :disabled="!canSave">Salveaza</b-button>

      <b-button tag="router-link" to="/game">Inapoi</b-button>
    </div>
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

    setFinishOrder(playerIndex, orderIndex) {
      const finishOrderMatrixRow = this.finishOrderMatrix[playerIndex];

      finishOrderMatrixRow[orderIndex] = !finishOrderMatrixRow[orderIndex];

      this.$set(this.finishOrderMatrix, playerIndex, finishOrderMatrixRow);
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

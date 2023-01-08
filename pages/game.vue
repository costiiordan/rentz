<template>
  <section class="section">
    <b-table :data="subGameMatrix" :bordered="true" :mobile-cards="false">

      <b-table-column
        v-for="(player, index) in players"
        :key="'gameMatrix'+index"
        :label="player"
        v-slot="props">
        <b-button
          v-if="props.row.played[index]"
          disabled
          expanded
        >
          {{ props.row.subGame.name }}
        </b-button>
        <b-button
          v-else
          :type="playerTurnIndex === index ? 'is-primary' : 'is-primary'"
          :disabled="playerTurnIndex !== index"
          expanded
          @click="navigateToGame(props.row.subGame.key)"
        >
          {{ props.row.subGame.name }}
        </b-button>
      </b-table-column>

    </b-table>

    <b-table :data="scoreMatrix" :bordered="true" :mobile-cards="false" class="mt-3">

      <b-table-column
        v-for="(player, index) in ['Joc', 'Ales de', ...players]"
        :key="'scoreMatrix'+index"
        :label="player"
        v-slot="props"
      >
        {{ props.row[index] }}
      </b-table-column>

    </b-table>

    <div class="notification">
      Jocuri ramase: {{ subGamesLeftToPlay }}
    </div>

    <div class="buttons">
      <b-button v-else type="is-primary" @click="newGame()">Joc Nou</b-button>
      <button v-if="subGameRounds.length > 0" class="button is-danger is-outlined" @click="openDeleteLastRoundConfirmationModal()">Sterge ultima runda</button>
      <b-button v-if="subGamesLeftToPlay > 0" tag="router-link" to="/set-players">Modifica jucatori</b-button>
    </div>

    <b-modal
      v-model="isDeleteLastRoundConfirmationModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Confirmare actiune"
      close-button-aria-label="Inchide"
      aria-modal>
      <template #default="props">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirmare</p>
            <button
              type="button"
              class="delete"
              @click="closeDeleteLastRoundConfirmationModal()"/>
          </header>
          <section class="modal-card-body">
            Esti sigur ca vrei sa stergi ultima runda din joc?
          </section>
          <footer class="modal-card-foot">
            <b-button
              label="Nu, inchide"
              @click="closeDeleteLastRoundConfirmationModal()" />
            <b-button
              label="Da, sterge"
              type="is-primary"
              @click="deleteLastSubGameRoundHandler()"/>
          </footer>
        </div>
      </template>
    </b-modal>
  </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  middleware: ['game'],
  data() {
    return {
      subGameMatrix: [],
      scoreMatrix: [],
      isDeleteLastRoundConfirmationModalOpen: false
    }
  },
  computed: {
    ...mapGetters({
      playerTurnIndex: "game/getPlayerTurnIndex",
      players: "game/getPlayers",
      rentzGame: "game/getRentzGame",
      subGameRounds: "game/getSubGameRounds",
    }),
    subGamesLeftToPlay() {
      return (this.players.length * this.rentzGame.getSubGames().length) - this.subGameRounds.length
    }
  },
  created() {
    this.calculateMatrix();
  },
  methods: {
    ...mapActions({
      restartGame: "game/restartGame",
      deleteLastSubGameRound: "game/deleteLastSubGameRound"
    }),
    navigateToGame(gameKey) {
      if (['rentzDirect', 'rentzIndirect'].includes(gameKey)) {
        this.$router.push({path: '/sub-game', query: {game: gameKey}});

        return;
      }

      this.$router.push({path: '/sub-game', query: {game: gameKey}})
    },
    newGame() {
      this.restartGame();

      this.$router.push({path: "/set-players"})
    },
    deleteLastSubGameRoundHandler() {
      this.deleteLastSubGameRound();
      this.calculateMatrix();
      this.closeDeleteLastRoundConfirmationModal();
    },
    calculateMatrix() {
      this.subGameMatrix = this.rentzGame.getSubGames().map(subGame => {
        return {
          subGame: subGame,
          played: this.players
            .map((player, playerIndex) => this.subGameRounds.filter(
              subGameRound => subGameRound.playerIndex === playerIndex && subGameRound.subGameType === subGame.key
            ).length === 1)
        };
      });

      this.scoreMatrix = this.subGameRounds.map(subGameRound => [
        this.rentzGame.getSubGame(subGameRound.subGameType).name,
        this.players[subGameRound.playerIndex],
        ...subGameRound.playerSubGameResults.map(subGameResult => subGameResult.points)
      ]);
      this.scoreMatrix.push([
        'Total',
        '',
        ...this.players.map(
          (player, playerIndex) => this.subGameRounds.reduce(
            (partialSum, subGameRound) => partialSum + subGameRound.playerSubGameResults
              .filter(playerSubGameResult => playerSubGameResult.playerIndex === playerIndex)
              .map(playerSubGameResult => playerSubGameResult.points)[0]
            , 0
          )
        )
      ]);
    },
    openDeleteLastRoundConfirmationModal() {
      this.isDeleteLastRoundConfirmationModalOpen = true;
    },
    closeDeleteLastRoundConfirmationModal() {
      this.isDeleteLastRoundConfirmationModalOpen = false;
    }
  }
}
</script>

<template>
  <section class="section">
    <b-tabs :animated="false">
      <b-tab-item
        v-for="(player, playerIndex) in players"
        :key="'player'+playerIndex"
        :label="player.name">
        <b-field
          v-for="(pointType, pointTypeIndex) in game.points"
          :key="'pointKey'+pointTypeIndex"
          :label="rentzGame.getPointTypeName(pointType)">
          <b-numberinput v-model="player[pointType]" :min="0"
                         :max="getMaxPointsType(pointType, playerIndex)"></b-numberinput>
        </b-field>

        <div class="notification is-link is-light">Total: <strong>{{ playersTotalPoints[playerIndex] }}</strong></div>
      </b-tab-item>
    </b-tabs>

    <b-button type="is-primary" @click="save()" :disabled="!canSave">Salveaza</b-button>

    <b-button tag="router-link" to="/game">Inapoi</b-button>
  </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {RentzGame} from "../game/RentzGame";

export default {
  name: 'NegativeSubGame',
  data() {
    return {
      rentzGame: null,
      game: null,
      players: []
    }
  },
  computed: {
    ...mapGetters({
      storePlayers: "game/getPlayers",
      playerTurnIndex: "game/getPlayerTurnIndex"
    }),
    canSave() {
      const playersPoints = this.playersTotalPoints
          .reduce((partialSum, points) => partialSum + points, 0);
      const gamePoints = this.game.points
          .map(pointsType => this.rentzGame.calculateTotalPoints(pointsType))
          .reduce((partialSum, points) => partialSum + points, 0);

      return playersPoints === gamePoints;
    },
    playersTotalPoints() {
      const rentzGame = new RentzGame(this.players.length === 4 ? '4players' : '6players');

      return this.players.map(player => {
        return rentzGame.calculatePoints('dame', player.dame)
          + rentzGame.calculatePoints('carouri', player.carouri)
          + rentzGame.calculatePoints('levate', player.levate)
          + rentzGame.calculatePoints('popa', player.popa);
      });
    }
  },
  created() {
    this.players.push(...this.storePlayers.map(player => {
      return {
        name: player,
        dame: 0,
        carouri: 0,
        levate: 0,
        popa: 0,
      };
    }));

    this.rentzGame = new RentzGame(this.players.length === 4 ? '4players' : '6players');

    this.game = this.rentzGame.getSubGame(this.$router.currentRoute.query.game);
  },
  methods: {
    ...mapActions({saveGameRound: "game/saveGameRound"}),

    save() {
      if (!this.canSave) {
        return;
      }

      const gameRound = {
        playerIndex: this.playerTurnIndex,
        subGameType: this.game.key,
        playerSubGameResults: this.players.map((player, index) => {
          return {
            playerIndex: index,
            rentzDirect: null,
            rentzIndirect: null,
            dame: player.dame,
            carouri: player.carouri,
            levate: player.levate,
            popa: player.popa,
            points: this.rentzGame.calculatePoints('dame', player.dame)
              + this.rentzGame.calculatePoints('carouri', player.carouri)
              + this.rentzGame.calculatePoints('levate', player.levate)
              + this.rentzGame.calculatePoints('popa', player.popa)
          }
        })
      };

      this.saveGameRound(gameRound);

      this.$router.push('/game');
    },

    getMaxPointsType(pointType, playerIndex) {
      const maxCards = this.rentzGame.getMaxCards(pointType);
      const assignedPoints = this.players.map(player => player[pointType]).reduce((partialSum, points) => partialSum + points, 0);
      const playerAssignedPoints = this.players[playerIndex][pointType];

      return maxCards - (assignedPoints - playerAssignedPoints);
    }
  }
}
</script>

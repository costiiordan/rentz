<template>
  <div>
    <PositiveSubGame v-if="isPositiveSubGame"/>
    <NegativeSubGame v-else/>
  </div>
</template>

<script>
import NegativeSubGame from "~/components/NegativeSubGame";
import PositiveSubGame from "../components/PositiveSubGame";

export default {
  middleware: ["subgame"],
  components: {
    PositiveSubGame,
    NegativeSubGame
  },
  computed: {
    isPositiveSubGame() {
      return ['rentzDirect', 'rentzIndirect'].includes(this.$router.currentRoute.query.game);
    }
  }
}
</script>

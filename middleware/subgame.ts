import {SubGameRound} from "~/store/game";
import {Context} from "@nuxt/types";

export default function (context: Context) {
    const subGameType = context.query.game;

    if (!subGameType) {
        return context.redirect('/game');
    }

    const rentzGame = context.store.getters["game/getRentzGame"];

    if (!rentzGame.isSubGame(subGameType as string)) {
        return context.redirect('/game');
    }

    const playerIndex = context.store.getters["game/getPlayerTurnIndex"];
    const canPlaySubGame = context.store.getters["game/getSubGameRounds"]
        .filter((round: SubGameRound) => round.playerIndex === playerIndex && round.subGameType === subGameType)
        .length === 0;

    if (!canPlaySubGame) {
        return context.redirect('/game');
    }
}

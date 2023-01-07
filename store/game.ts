import {SubGameType, RentzGame} from "~/game/RentzGame";
import {ActionContext} from "vuex";

const LOCAL_STORAGE_KEY = "RentzGame";

export interface State {
    rentzGame: RentzGame|null,
    players: Array<string>,
    subGameRounds: Array<SubGameRound>
}

export interface PlayerSubGameResult {
    playerIndex: number,
    rentzDirect: number,
    rentzIndirect: number,
    dame: number,
    carouri: number,
    levate: number,
    popa: number,
    points: number
}

export interface SubGameRound {
    playerIndex: number,
    subGameType: SubGameType
    playerSubGameResults: Array<PlayerSubGameResult>
}

export interface LocalStorageData {
    players: Array<string>,
    subGameRounds: Array<SubGameRound>
}

export const state = () => ({
    init: false,
    rentzGame: null,
    players: [],
    subGameRounds: []
})

export const getters = {
    getPlayers(state: State) {
        return state.players
    },
    getPlayerTurnIndex(state: State) {
        return state.subGameRounds.length % state.players.length;
    },
    getRentzGame(state: State): RentzGame|null {
        return state.rentzGame;
    },
    getSubGameRounds(state: State): Array<SubGameRound> {
        return state.subGameRounds;
    },
    isOngoingGame(state: State): boolean {
        return state.subGameRounds.length > 0;
    }

}

export const mutations = {
    setPlayers(state: State, players: Array<string>) {
        state.players = players;
    },
    setRentzGame(state: State) {
        if (!state.players.length) {
            state.rentzGame = null;
        }

        state.rentzGame = new RentzGame(state.players.length === 4 ? '4players' : '6players');
    },
    addSubGameRound(state: State, subGameRound: SubGameRound) {
        state.subGameRounds.push(subGameRound);
    },
    addSubGameRounds(state: State, subGameRounds: Array<SubGameRound>) {
        state.subGameRounds = subGameRounds;
    },
    deleteSubGameRounds(state: State) {
        state.subGameRounds = [];
    }
}

export const actions = {
    initGame({ commit }: ActionContext<State, {}>): void {
        const dataString = localStorage.getItem(LOCAL_STORAGE_KEY);
         if (!dataString) {
            return;
         }

         const data: LocalStorageData = JSON.parse(dataString);

         commit("setPlayers", data.players);
         commit("addSubGameRounds", data.subGameRounds);
         commit("setRentzGame");
    },
    savePlayers({ commit, dispatch }: ActionContext<State, {}>, players: Array<string>): void {
        commit("setPlayers", players);
        commit("setRentzGame");
        dispatch("saveGame");
    },
    saveGameRound({ commit, dispatch }: ActionContext<State, {}>, subGameRound: SubGameRound): void {
        commit("addSubGameRound", subGameRound);
        dispatch("saveGame");
    },
    restartGame({ commit, dispatch }: ActionContext<State, {}>) {
        commit("setPlayers", []);
        commit("setRentzGame");
        commit("deleteSubGameRounds");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
    saveGame({ state }: ActionContext<State, {}>) {
        const data: LocalStorageData = {
            players: state.players,
            subGameRounds: state.subGameRounds
        };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
};

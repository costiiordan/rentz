export type PointsType = 'rentzDirect'|'rentzIndirect'|'dame'|'carouri'|'levate'|'popa';
export type SubGameType = 'dameCuCarouri'|'popaCuLevate'|'totale'|'rentzDirect'|'rentzIndirect';
export type NegativeSubGamesType = 'dame'|'carouri'|'levate'|'popa';
export type PlayersCount = '4players'|'6players';

export interface SubGame {
    name: string,
    key: string,
    points: Array<string>
}

export class RentzGame {
    private pointTypes = {
        rentzDirect: {
            name: 'Rentz direct',
            '4players': [120, 80, 40, 0],
            '6players': [150, 130, 100, 70, 30, 0]
        },
        rentzIndirect: {
            name: 'Rentz indirect',
            '4players': [0, 40, 80, 120],
            '6players': [0, 30, 70, 100, 130, 150]
        },
        dame: {
            name: 'Dame',
            '4players': {
                points: -20,
                cards: 4
            },
            '6players': {
                points: -30,
                cards: 4
            }
        },
        carouri: {
            name: 'Carouri',
            '4players': {
                points: -5,
                cards: 8
            },
            '6players': {
                points: -10,
                cards: 12
            }
        },
        levate: {
            name: 'Levate',
            '4players': {
                points: -5,
                cards: 8
            },
            '6players': {
                points: -15,
                cards: 8
            }
        },
        popa: {
            name: 'Popa de rosu',
            '4players': {
                points: -80,
                cards: 1
            },
            '6players': {
                points: -120,
                cards: 1
            }
        },
    };

    private subGames = {
        dameCuCarouri: {
            name: 'D. + R.',
            points: ['dame', 'carouri']
        },
        popaCuLevate: {
            name: 'P.R. + L.',
            points: ['popa', 'levate']
        },
        totale: {
            name: 'T.',
            points: ['dame', 'carouri', 'popa', 'levate']
        },
        rentzDirect: {
            name: 'R.D.',
            points: ['rentzDirect']
        },
        rentzIndirect: {
            name: 'R.I.',
            points: ['rentzIndirect']
        },
    }

    constructor(private playersCount: PlayersCount) {
    }

    public calculatePoints(pointType: PointsType, count: number): number {
        const gamePoints = this.pointTypes[pointType][this.playersCount];

        if (['rentzDirect', 'rentzIndirect'].includes(pointType)) {
            // @ts-ignore
            return gamePoints[count];
        }

        // @ts-ignore
        return gamePoints.points * count;
    }

    public calculateTotalPoints(pointType: PointsType): number {
        const subGamePoints = this.pointTypes[pointType][this.playersCount];

        if (['rentzDirect', 'rentzIndirect'].includes(pointType)) {
            // @ts-ignore
            return subGamePoints.reduce((partialSum, a) => partialSum + a, 0);
        }

        // @ts-ignore
        return subGamePoints.points * subGamePoints.cards;
    }

    public getSubGames(): Array<SubGame> {
        const subGames: Array<SubGame> = [];

        for (const subGameKey in this.subGames) {
            // @ts-ignore
            const subGame = this.subGames[subGameKey];
            subGames.push({
                name: subGame.name,
                key: subGameKey,
                points: subGame.points
            })
        }

        return subGames;
    }

    public getMaxCards(pointType: NegativeSubGamesType): number {
        return this.pointTypes[pointType][this.playersCount].cards;
    }

    public getSubGame(subGameType: SubGameType): SubGame {
        return {
            ...this.subGames[subGameType],
            key: subGameType
        };
    }

    public getPointTypeName(pointType: PointsType): string {
        return this.pointTypes[pointType].name;
    }

    public isSubGame(subGameKey: string): boolean {
        return this.subGames.hasOwnProperty(subGameKey);
    }
}

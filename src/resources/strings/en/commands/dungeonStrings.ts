const dungeonStrings = {
    monsterEncountered: '{0}, you have encountered a {1}.',
    yourAttack: 'Your attack:\n',
    monsterAttack: `{0}'s attack:\n`,
    playerHPLeft: `{0} has {1}/{2} HP left!`,
    waitingForPlayer : `Waiting for player turn...`,
    dungeonOnCooldown: `{0}, {1} seconds until next dungeon`,
    dungeonFooter: `{0}'s dungeon exploration`,
    dungeonBattleWinnerStrings: [
        '{0} was brutally massacred by {1}',
        '{0} has been defeated by {1}',
        '{0} has been killed by {1}',
        '{0} has been obliterated by {1}'

    ],
    dungeonBattleTimeoutStrings:[
        '{0} ran away...',
        '{0} escaped...'
    ],
    dungeonObtainItemFromMonster: `{0} obtained a {1} from killing {2}`
};

export default dungeonStrings;

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
    dungeonPlayerStrLevelUp:`Defeating a {0} has increased {1}'s strength by {2}!`,
    dungeonObtainItemFromMonster: `{0} obtained a {1} from killing {2}`,
    dungeonBattleResultTitle:`👑 Battle Result`,
    dungeonBattleResultEXPGained:`{0} gained {1} EXP\n\n{2}/{3}({4}) to next level.\n\n`,
    dungeonItemObtained: `💰 Item Obtained`,
    dungeonFloorNotUnlocked: `{0}, You have not unlocked dungeon floor {1} yet.`,
    dungeonInvalidFloor: `{0}, {1} is not a valid dungeon floor.`,
    dungeonUnlockTerms: `{0} can be unlocked by defeating a {1} in floor {2}`,
    dungeonFloorUnlockedTitle: `🚪 Dungeon Floor Unlocked`,
    dungeonFloorUnlockedString: `{0} has unlocked Dungeon floor {1}`
};

export default dungeonStrings;

const attackStrings = {
    attackCooldown: '{1}, {0} seconds until next attack.',
    attackerIsDead: '{0} is dead. They will need to respawn.',
    targetAlreadyDead:[
        '{0} is already dead, so {1} stabs their body a few times. How could {1}} do such a thing?',
        '{0} is already dead, so {1} spit on their body.',
        '{0} is already dead, so {1} poo on their hand and drew a smiley face on {0}\'s body with their poo.',
        `{0} is already dead, so {1}} licked their ass cheeks.`,
    ],
    attackTargetLives:'__{0} attacked {1} for {2} damage!__\n\n' +
        '{1} has {3}/{4} HP left!',
    attackTargetKilled: '{0} has been killed!',
    attackCritical: '__{0} dealt a mortal blow to {1}!__\n\n',
    attackSelf:[
        '{0} brings the gun to their head but ends up shitting themself instead of pulling the trigger',
        `{0} brings the knife to their throat but realize it's a butter knife so they use it to make some avocado toast because it's healthy`,
        `{0} farts loudly just as they are about to hit themself and the smells knocks them out`,
        `{0} punches themself so hard they wake up in narnia.`
    ],
    attackSelfSuffix:[
        '',
        '\n dum pusc',
        '\n idiot lol!',
        '\n haha lmao!!!',
    ],
    invalidTarget: `Invalid target specified.`,
    targetStrengthened: `Getting attacked has made {0} stronger!\n\n{0}'s Strength has increased by {1}!`,
    attackerStrengthened: `Attacking has made {0} stronger!\n\n{0}'s Strength has increased by {1}!`

};

export default attackStrings;

const attackStrings = {
    attackCooldown: '{1}, {0} seconds until your next attack.',
    attackerIsDead: 'You are dead. You need to respawn before attacking again.',
    targetAlreadyDead:[
        '{0} is already dead, so you stab their body a few times. How could you do such a thing?',
        '{0} is already dead, so you spit on their body.',
        '{0} is already dead, so you poo on your hand and draw a smiley face on their body with your poo.',
        `{0} is already dead, so you lick his ass cheeks.`,
    ],
    attackAlsoUsedUp: 'Also, your attack has been used up.',
    attackTargetLives:'{0} attacked {1} for {2} damage!\n' +
        '{1} has {3}/{4} HP left!',
    attackTargetKilled: '{0} has been killed!',
    attackCritical: '{0} dealt a mortal blow to {1}!\n\n',
    attackSelf:[
        'You bring the gun to your head but end up shitting yourself instead of pulling the trigger',
        `You bring the knife to your throat but realize it's a butter knife so you use it to make some avocado toast because its healthy`,
        `You fart loudly just as you are about to hit yourself and the smells knocks you out`,
        `You punch yourself so hard you wake up and find yourself in narnia.`
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

const dungeonMonsterStrings = {
    DMON0001: {
        name: "Snakedon",
        description: "A cross between a snake and a really racist individual.",
        attackStrings: [
            "__Snakedon yells racist insults at {0} for {1} damage!__",
            "__Snakedon flashes his asshole at {0} for {1} damage!__",
            "__Snakedon screams autistically at {0} for {1} damage!__"
        ],
        attackStringsCrit: [
            "__Snakedon farted in his hand and cupped it over {0}'s face for {1} damage! (CRITICAL HIT)!__",
        ],
        img: 'https://i.imgur.com/FUbrYR9.png',
        imgDead: 'https://i.imgur.com/Zmtq0Ky.png'
    },
    DMON0005: {
        name: 'Magical Girl Sachan',
        description: 'When aussie roid rage meets magical girls',
        attackStrings: [
            "__Magical Girl Sachan casts firebolt at {0} for {1} damage!__",
            "__Magical Girl Sachan blows a kiss at {0} for {1} damage!__"
        ],
        attackStringsCrit: [
            "__Magical Girl Sachan uses magical girl roid rage on {0} for {1} damage (CRITICAL HIT)!__"
        ],
        img: 'https://i.imgur.com/6nxdzdy.png',
        imgDead: 'https://i.imgur.com/XukP8Wq.png'
    }
};

export default dungeonMonsterStrings;

const Timers ={
    rpg:{
        attackCD: 25,
        deathCD: 45,
        healCD: 45,
        notificationTimer: 60, // Only notify player if they have been away since 30 seconds from their last attack
        unFlagTimer: 60, // Can only unflag after x amount of seconds from last attack
        afkTimer: 1800,
        dungeonTimer: 1,
        healItemTimer: 60,
        buffItemTimer: 60
    }
};

export default Timers;

const Timers ={
    rpg:{
        attackCD: 25,
        deathCD: 30,
        healCD: 20,
        notificationTimer: 60, // Only notify player if they have been away since 30 seconds from their last attack
        unFlagTimer: 60, // Can only unflag after x amount of seconds from last attack
        afkTimer: 1800,
        dungeonTimer: 30,
        healItemTimer: 45,
        buffItemTimer: 60
    }
};

export default Timers;

import {FindOrCreateRPGServerStats} from "../../../models/rpg/RPGServerStats";
import RPGDropTable from "../../../models/rpg/RPGDropTable";
import RPGTools from "../../rpg/RPGTools";
import CommandArgs from "../../../classes/CommandArgs";
import replace from "../../replace";

const ProcessOnMessageItemDrop = (args: CommandArgs) => {
    const msg = args.message;
    let reactionMsg = null;
    let itemIDToDrop = null;
    return new Promise((resolve, reject) => {
        FindOrCreateRPGServerStats(msg.guild.id)
            .then((rpgServerStats) => {
                if (!rpgServerStats.itemDropChannels.includes(msg.channel.id)) {
                    console.log('channel does not drop items');
                    return;
                }
                if (RPGTools.GetRandomIntegerFrom(100) < rpgServerStats.onMessageDropChance) {
                    // Load drop table
                    return RPGDropTable.findOne({dropTableID: rpgServerStats.onMessageDropTable})
                }
                reject(new Error('Failed item roll'));
            })
            .then((dt: any) => {
                let totalChance = 0;
                let dropTable = dt.table;
                dropTable.forEach((drop: any) => {
                    totalChance += drop.chance;
                    drop.chance = totalChance;
                });
                dropTable.sort((a, b) => a.chance - b.chance);

                const itemDropRoll = RPGTools.GetRandomIntegerFrom(100);
                let counter = 0;

                while (counter < dropTable.length) {
                    if (itemDropRoll < dropTable[counter].chance) {
                        itemIDToDrop = dropTable[counter].itemID;
                        counter = dropTable.length;
                    }
                    counter++;
                }
                console.log(itemDropRoll);
                console.log('Dropping:', itemIDToDrop);

                return args.sendOKEmbed({
                    contents: replace(args.strings.itemDropped,
                        [args.strings[itemIDToDrop].name])
                });

            })
            .then((msg) => {

                reactionMsg = msg;

                return reactionMsg.react('👌');
            })
            .then(() => {
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '👌';
                };

                reactionMsg.awaitReactions(filter, {max: 2, time: 10000, error: ['time']})
                    .then(collected => {
                        reactionMsg.delete();
                        const reactingUser = collected.get('👌').users.array()[1];
                        if(reactingUser){
                            RPGTools.AddItemToUserInventory(reactingUser.id, itemIDToDrop);
                            args.sendOKEmbed({
                                contents: replace(args.strings.itemPickedUp, [args.message.author.username,
                                    args.strings[itemIDToDrop].name])
                            })
                        }
                    })
                    .catch(collected => console.log(collected, 'but error'));

                resolve(true);

            })
            .catch((err) => {
                reject(new Error('Error retrieving rpg server stats'));
            })
    })
}


export default ProcessOnMessageItemDrop;

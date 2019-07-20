import {FindOrCreateRPGServerStats} from "../../../models/rpg/RPGServerStats";
import RPGDropTable from "../../../models/rpg/RPGDropTable";
import RPGTools from "../../rpg/RPGTools";
import CommandArgs from "../../../classes/CommandArgs";
import replace from "../../replace";

const ProcessOnMessageItemDrop = (args: CommandArgs) => {
    const msg = args.message;
    const itemExpireTime = 15;
    let reactionMsg = null;
    let itemIDToDrop = null;
    return new Promise((resolve, reject) => {
        FindOrCreateRPGServerStats(msg.guild.id)
            .then((rpgServerStats) => {
                if (!rpgServerStats.itemDropChannels.includes(msg.channel.id)) {
                    reject(new Error('Channel does not drop items'));
                }
                if (RPGTools.GetRandomIntegerFrom(100) < rpgServerStats.onMessageDropChance) {
                    // Load drop table
                    return RPGDropTable.findOne({dropTableID: rpgServerStats.onMessageDropTable})
                }
                reject(new Error('Failed item roll'));
            })
            .then((dt: any) => {
                itemIDToDrop = RPGTools.GetItemIDFromTable(dt.table);
                console.log('Dropping:', itemIDToDrop);

                return args.sendOKEmbed({
                    contents: replace(args.strings.itemDropped,
                        [RPGTools.GetItemName(itemIDToDrop)]),
                    footer: replace(args.strings.msgWillDisappear,
                        [itemExpireTime], false)
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

                reactionMsg.awaitReactions(filter, {max: 2, time: itemExpireTime * 1000, error: ['time']})
                    .then(collected => {
                        reactionMsg.delete();
                        const reactingUser = collected.get('👌').users.array()[1];
                        if (reactingUser) {
                            RPGTools.AddItemToUserInventory(reactingUser.id, itemIDToDrop);
                            args.sendOKEmbed({
                                contents: replace(args.strings.itemPickedUp, [reactingUser.username,
                                    RPGTools.GetItemName(itemIDToDrop)]),
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

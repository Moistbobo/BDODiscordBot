import CommandArgs from "../../classes/CommandArgs";
import RPGTools from "../../tools/rpg/RPGTools";

const createItem = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const itemID = args.message.content.split(' ')[0];
    const qty = parseInt(args.message.content.split(' ')[1]) || 1;
    const mentionedUser = args.bot.getFirstMentionedUserID(args.message);


    if (!args.message.content || args.message.member.id !== '80300923351465984') return;

    if (mentionedUser) {
        RPGTools.AddItemToUserInventory(mentionedUser.id, itemID, qty).then(() => {
            args.sendOKEmbed({
                contents: `Gave ${mentionedUser} a ${RPGTools.GetItemName(itemID)}`
            })
        })
    }else{
        console.log(qty);
        RPGTools.AddItemToUserInventory(userID, itemID, qty)
            .catch((err) => {
                console.log(err.toString());
            })
    }
};

export const action = createItem;

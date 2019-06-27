import CommandArgs from "../../classes/CommandArgs";

const value = (args: CommandArgs) =>{
    const enteredValue = args.message.content.split( ' ')[1];

    if(isNaN(parseFloat(enteredValue))){
        return args.message.channel.send('Enter a valid number');
    }

    const baseSellPrice = parseFloat(enteredValue.replace(/,/g,''))*0.65;
    const valuePackPrice = baseSellPrice * 1.30;

    args.message.channel.send(`An item sold for \`${enteredValue}\` will earn\n\`${baseSellPrice.toFixed(0)}\` without value pack\n\`${valuePackPrice.toFixed(0)}\` with value pack\n\nThis is not adjusted for the extra fame bonus.`)
};

export const action = value;
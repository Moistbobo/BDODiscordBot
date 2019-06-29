import CommandArgs from "../../classes/CommandArgs";

/**
 * Remove sigfigs and add commas to every third digit
 * @param num
 */
const formatNumber = (num: number): String => {
    return parseFloat(num.toFixed(0)).toLocaleString('en-US');
};

const toHumanReadable = (num: number): String => {
    // Only for numbers above 1 million
    //1 000 000 000
    const numString = num.toString();
    let returnString = '';

    if (num >= 1000000000) {
        returnString = `${(parseFloat(numString) / 1000000000)}bil`;
    } else if (num >= 1000000) {
        returnString = `${(parseFloat(numString) / 1000000)}mil`;
    }

    return returnString
};

const wrapInputWithFormatting = (str: String): String => {
    return ` \`(${str})\` `
};

const toMachineReadable = (num: String): number => {
    const numLower = num.toLowerCase();
    if (numLower.split('b').length > 1) {
        return parseFloat(numLower.split('b')[0]) * 1000000000;
    } else if (numLower.split('m').length > 1) {
        return parseFloat(numLower.split('m')[0]) * 1000000;
    } else if (numLower.split('k').length > 1) {
        return parseFloat(numLower.split('k')[0]) * 1000;
    } else {
        return -1;
    }
};

/**
 * Check if the provided value starts with a number
 * @param content
 */
const startsWithNumber = (content: string): boolean => {
    const regex = /^[0-9]/;
    return regex.test(content);
};

const value = (args: CommandArgs) => {
    const originalValue = args.message.content.split(' ')[1].toLowerCase();

    const priceBeforeConversion = originalValue.replace(/,/g, '');
    let sellingPrice = 0;

    // if (isNaN(parseFloat(priceBeforeConversion))) {
    if (originalValue.includes('b') ||
        originalValue.includes('m') ||
        originalValue.includes('k')) {
        // Maybe its a shorthand number (i.e 5bil)
        sellingPrice = toMachineReadable(priceBeforeConversion);
        if (sellingPrice === -1 || !startsWithNumber(originalValue)) {
            return args.sendErrorEmbed({contents: 'Enter a valid number.'});
        }
    } else {
        sellingPrice = parseFloat(priceBeforeConversion);
    }

    const baseSellPrice = sellingPrice * 0.65;
    const valuePackPrice = baseSellPrice * 1.30;

    // only insert human readable if base sell price is greater than 1mil
    const needHumanReadable = baseSellPrice > 1000000;
    // TODO: reduce this to something shorter
    args.sendOKEmbed({contents: `An item sold for \`${formatNumber(sellingPrice)}\` will earn\n\`${formatNumber(baseSellPrice)}\`${needHumanReadable ? wrapInputWithFormatting(toHumanReadable(baseSellPrice)) : ' '}without value pack\n\`${formatNumber(valuePackPrice)}\`${needHumanReadable ? wrapInputWithFormatting(toHumanReadable(valuePackPrice)) : ' '}with value pack\n\nThis is not adjusted for the extra fame bonus.`});
};

export const action = value;

export const valueTest = {
    formatNumber,
    toHumanReadable,
    toMachineReadable,
    startsWithNumber
};
const replace = (base: string, values: any[], bold = true): string => {
    let finalString = base;
    if(!base) base = '';
    for (let i = 0; i < values.length; i++) {
        if (!base.includes(`{${i}}`)) {
            return finalString + '\nThe values provided to the base string to not match the replaceable ones.';
        }
        bold ?
            finalString = finalString.replace(new RegExp('\\{' + i + '\\}', 'g'), `**${values[i]}**`)
            :
            finalString = finalString.replace(new RegExp('\\{' + i + '\\}', 'g'), `${values[i]}`);
    }

    return finalString;
};

export default replace;

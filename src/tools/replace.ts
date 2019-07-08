const replace = (base: string, values: string[]):string =>{
    let finalString = base;
    for(let i = 0; i < values.length; i++){
        if(!base.includes(`{${i}}`)){
            return finalString + '\nThe values provided to the base string to not match the replaceable ones.';
        }
        finalString = finalString.replace(new RegExp('\\{'+i+'\\}', 'g'), values[i]);
    }

    return finalString;
};

export default replace;

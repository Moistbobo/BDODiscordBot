
const helloWorld = (args) => {
    const strings = args.strings.helloWorld;
    console.log(strings);
    console.log(strings.action);
};

export const action = helloWorld;
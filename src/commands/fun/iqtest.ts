import CommandArgs from "../../classes/CommandArgs";
import Images from "../../resources/images";
import Jimp from 'jimp';
import IQTestResult from "../../models/iqtestResult";

const loadImages = () => {
    return Promise.all([
        Jimp.read(Images.iqTest.iqChart)
            .then((iqChart) => {
                return iqChart;
            }),
        Jimp.read(Images.iqTest.iqMark)
            .then((iqMark) => {
                return iqMark;
            })
    ])
};

/**
 * Make /gtts directory to store tts files if it doesn't exist
 */
const makeIQFolderIgNotExists = () => {
    const fs = require('fs');
    if (!fs.existsSync('./iqtest')) {
        fs.mkdirSync('./iqtest');
    }
};

const plotIQMark = (xMax: number) => {
    return Math.floor(Math.random() * Math.floor(xMax));
};

const mapPlotPointToIQ = (xPlot: number, iqMax: number, iqMin: number, imageMax: number, imageMin: number) => {
    return ((xPlot - imageMin) / (imageMax - imageMin)) * (iqMax - iqMin) + iqMin;
};

const saveIQTestResult = (userID: string, iq: number): Promise<any> => {
    const newIQTestResult = new IQTestResult();
    newIQTestResult.lastUpdate = Date.now() / 1000;
    newIQTestResult.userID = userID;
    newIQTestResult.iq = iq;
    return newIQTestResult.save();
};

const convertToHumanReadable = (seconds: number) => {
    let d = seconds;
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
};

const sendIQMessage = (channel: any, iq: number, authorID: string) => {
    return channel.send({
        embed: {
            description: `Your iq: ${iq}${iq > 300 ? `\nDon't worry, you're still stupid` : ''}`,
        },
        files: [{
            attachment: `./iqtest/${authorID}.png`,
            name: 'iqtest.png'
        }]
    });
};

const iqTest = (args: CommandArgs) => {
    // First check if the user is allowed to update
    const userID = args.message.author.id;
    args.message.channel.startTyping();

    let iq = 0;
    // Promise chaining is cool and all but I should really reduce this
    IQTestResult.findOne({userID})
        .then((iqTestResult) => {
            if (iqTestResult) {
                const currentTime = Date.now() / 1000;
                console.log(currentTime - iqTestResult.lastUpdate);
                return {timeDifference: (currentTime - iqTestResult.lastUpdate), iqTestResult};
            } else {
                return {timeDifference: 86400};
            }
        })
        .then((res) => {
            if (res.timeDifference < 86400) {
                sendIQMessage(args.message.channel, res.iqTestResult.iq, args.message.author.id);
                throw new Error('IQ Cooldown not met');
            } else {
                return loadImages();
            }
        })
        .then((images) => {
            const iqChart = images[0];
            const iqMark = images[1];
            const xPlot = plotIQMark(400);
            iq = mapPlotPointToIQ(xPlot, 400, 0, iqChart.getWidth(), 0);
            return iqChart.composite(iqMark, xPlot, 5);
        })
        .then((compositedImage) => {
            makeIQFolderIgNotExists();
            return compositedImage.writeAsync(`./iqtest/${args.message.author.id}.png`);
        })
        .then(() => {
            return saveIQTestResult(args.message.author.id, iq);
        })
        .then(() => {
            args.message.channel.stopTyping();
            return sendIQMessage(args.message.channel, iq, args.message.author.id);

        })
        .catch((err)=>{
            console.log(err.toString());
            args.message.channel.stopTyping();
        });
};

export const action = iqTest;
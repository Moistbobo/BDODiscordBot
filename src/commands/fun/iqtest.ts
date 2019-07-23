import CommandArgs from "../../classes/CommandArgs";
import Images from "../../resources/images";
import Jimp from 'jimp';
import IQTestResult, {IIQTestResult} from "../../models/iqtestResult";
import {successMessageColor} from '../../config.json';

const iqTest = (args: CommandArgs) => {
    let iq = 0;

    let userID = args.message.author.id;

    console.log(userID);
    const mentionedUser = args.bot.getFirstMentionedUserID(args.message);
    console.log(mentionedUser);
    if (mentionedUser) {
        userID = mentionedUser.id;
    }

    const typing = args.message.channel.startTyping();

    // Check mongodb if user has run the "iqtest" within the last 24 hours (86400 seconds)
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
            // If delta from lastUpdated time is less than 24hours, break out of promise chain
            if (res.timeDifference < 86400) {
                // 24hour limit on iqtest command
                sendIQMessage(args.message.channel, res.iqTestResult.iq, userID);
                throw new Error('IQ Cooldown not met');
            } else {
                // Otherwise, load images and continue
                return loadImages();
            }
        })
        .then((images) => {
            // Generate random "iq" value and plot marker on graph
            const iqChart = images[0];
            const iqMark = images[1];
            const xPlot = plotIQMark(400);
            iq = mapPlotPointToIQ(xPlot, 400, 0, iqChart.getWidth(), 0);
            return iqChart.composite(iqMark, xPlot - iqMark.getWidth() / 2, 5);
        })
        .then((compositedImage) => {
            // Check if folder exists, and create it if it doesn't and then write the picture to a file
            makeIQFolderIfNotExists();
            return compositedImage.writeAsync(`./iqtest/${userID}.png`);
        })
        .then(() => {
            return saveIQTestResult(userID, iq);
        })
        .then(() => {
            args.message.channel.stopTyping();
            return sendIQMessage(args.message.channel, iq, userID);
        })
        .catch((err) => {
            args.message.channel.stopTyping();
            console.log(err.toString());
        })
};

const loadImages = (): Promise<any> => {
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
 * Create folder to hold the generated images
 */
const makeIQFolderIfNotExists = () => {
    const fs = require('fs');
    if (!fs.existsSync('./iqtest')) {
        fs.mkdirSync('./iqtest');
    }
};

/**
 * Generate random x value to plot the marker
 * @param xMax
 */
const plotIQMark = (xMax: number) => {
    return Math.floor(Math.random() * Math.floor(xMax));
};

/**
 * Apply linear transformation on the plot point so that it is mapped correctly on the graph
 * @param xPlot
 * @param iqMax
 * @param iqMin
 * @param imageMax
 * @param imageMin
 */
// This is only necessary if the scale on the image does not match the actual dimensions
const mapPlotPointToIQ = (xPlot: number, iqMax: number, iqMin: number, imageMax: number, imageMin: number) => {
    return ((xPlot - imageMin) / (imageMax - imageMin)) * (iqMax - iqMin) + iqMin;
};

/**
 * Save IQ test result with timestamp to mongodb
 * @param userID
 * @param iq
 */
const saveIQTestResult = (userID: string, iq: number): Promise<any> => {

    const currentTime = Date.now() / 1000;

    return new Promise((resolve, reject) => {
        IQTestResult.findOne(({userID}))
            .then((iqTestResult: IIQTestResult) => {
                if (iqTestResult) {
                    iqTestResult.lastUpdate = currentTime;
                    iqTestResult.iq = iq;
                    resolve(iqTestResult.save());
                } else {
                    const newIQTestResult = new IQTestResult();
                    newIQTestResult.lastUpdate = currentTime;
                    newIQTestResult.userID = userID;
                    newIQTestResult.iq = iq;
                    resolve(newIQTestResult.save());
                }
            })
            .catch((err) => {
                reject(new Error('Error saving iq test result'));
            })
    });
};

/**
 * Send embed message with generated image as an attachment
 * @param channel
 * @param iq
 * @param authorID
 */
const sendIQMessage = (channel: any, iq: number, authorID: any): Promise<any> => {
    return channel.send({
        embed: {
            description: `<@${authorID}>'s iq: ${iq}${iq > 300 ? `\nDon't worry, you're still stupid` : ''}`,
            color: successMessageColor
        },
        files: [{
            attachment: `./iqtest/${authorID}.png`,
            name: 'iqtest.png'
        }]
    });
};

export const action = iqTest;

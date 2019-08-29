import CommandArgs from "../../classes/CommandArgs";
import Images from "../../resources/images";
import Jimp from 'jimp';
import IQTestResult, {IIQTestResult} from "../../models/iqtestResult";
import {successMessageColor} from '../../config.json';
import {FindOrCreateNewFunResult} from "../../models/funResult";


const generateIQImage = async (iq: number) => {
    const iqMark = await Jimp.read(Images.iqTest.iqMark);
    const iqChart = await Jimp.read(Images.iqTest.iqChart);

    return iqChart.composite(iqMark, iq - iqMark.getWidth() / 2, 5);
};

const iqTest = (args: CommandArgs) => {
    let targetUser = args.bot.getFirstMentionedUserID(args.message);

    !targetUser ? targetUser = args.message.author : null;

    let funRes = null;

    FindOrCreateNewFunResult(targetUser.id)
        .then((res) => {
            makeIQFolderIfNotExists();

            funRes = res;

            if ((args.timeNow - funRes.iq.lastUpdate) < 86400) {
                // Generate iq message here
                return generateIQImage(funRes.iq.value);
                // sendIQMessage(args.message.channel, funRes.iq.value, targetUser.id );
                // throw new Error('IQ test cooldown not met');
            }

            // Generate new iq value
            const iq = generateIQ(400);
            funRes.iq.value = iq;
            funRes.iq.lastUpdate = args.timeNow;

            return generateIQImage(iq);
        })
        .then((compositeImage) => {
            const saveImagePromise = compositeImage.writeAsync(`./iqTest/${targetUser.id}.png`);
            return Promise.all([saveImagePromise, funRes.save()]);
        }).then(() => {
            return sendIQMessage(args.message.channel, funRes.iq.value, targetUser.id );
        }
    )
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
 * @param maxIQ
 */
const generateIQ = (maxIQ: number) => {
    return Math.floor(Math.random() * Math.floor(maxIQ));
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

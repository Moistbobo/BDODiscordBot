import CommandArgs from "../../classes/CommandArgs";
import Images from "../../resources/images";
import Jimp from 'jimp';

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

const mapPlotPointToIQ = (xPlot: number, iqMax: number, iqMin: number, imageMax:number, imageMin:number) =>{
    return ((xPlot - imageMin)/(imageMax - imageMin)) * (iqMax - iqMin)+ iqMin;
};

const iqTest = (args: CommandArgs) => {
    let iq = 0;
    // Load in the images
    loadImages()
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

            return args.message.channel.send({
                embed: {
                    description: `Your iq: ${iq}${iq>300?`\nDon't worry, you're still stupid`:''}`
                },
                files: [{
                    attachment: `./iqtest/${args.message.author.id}.png`,
                    name: 'iqtest.png'
                }]
            });
            // return args.message.channel.send({
            //     files: [`./iqtest/${args.message.author.id}.png`]
            // });
        })
};

export const action = iqTest;
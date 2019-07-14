import {Document, Schema, model} from 'mongoose';

export interface IRPGDropTable extends Document {
    dropTableID: string,
    table: [{
        itemID: string,
        chance: number
    }]
}

export const RPGDropTableSchema = new Schema({
    dropTableID: {
        type: String,
        required: true,
        unique: true
    },
    table: [{
        itemID: String,
        chance: Number
    }]
});

const RPGDropTable = model<IRPGDropTable>('RPGDropTable', RPGDropTableSchema);
export default RPGDropTable;


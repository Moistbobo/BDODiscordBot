import Item, {IItem, ItemTypes} from "../Item";

const CreateNewItem = (itemID: string, qty = 1):Promise<any> => {
    return new Promise((resolve, reject) => {
        Item.findOne({itemID})
            .then((item: any) => {
                if (!item) reject(new Error(`Item ID ${itemID} not found in database`));
                if(item.itemType === ItemTypes[0]){
                    qty = 1;
                }
                item.qty = qty;
                resolve(item);
            })
            .catch((err)=>{
                console.log(err.toString());
            })
    })

};

const ItemFactory = {
    CreateNewItem
};

export default ItemFactory;

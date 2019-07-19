import RPGMonsters from "../../../resources/rpg/monsters/RPGMonsters";

const CreateNewMonster = (monsterID: string) =>{
    if(!RPGMonsters.hasOwnProperty(monsterID)){
        return null;
    }
    let newMonster = JSON.parse(JSON.stringify(RPGMonsters[monsterID]));
    console.log('created new monster', newMonster);
    return newMonster;
};


const MonsterFactory ={
    CreateNewMonster
};

export default MonsterFactory;

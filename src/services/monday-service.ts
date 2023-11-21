import mondayRepo from '../repositories/monday-repository';
import { Item, Column } from '../repositories/domain/ItemInformationResponse';

interface IMondayService {
    updateItemName(boardId: number, itemId: number, value: string): Promise<boolean>;
}

class MondayService implements IMondayService {
  async updateItemName(boardId: number, itemId: number, value: string): Promise<boolean> { 
    try {  
        //Get infos from item
        const item: Item | undefined = await mondayRepo.getItemInformations(itemId);

        if (!item) {
            return false;
        }

        //Search for values to use in new name
        const valuesToUse: string[] = this.parseNameStructure(value);

        //Create new name
        let newName: string = value;
        for (let index in valuesToUse) {
            const regEx = new RegExp(valuesToUse[index]);

            switch(valuesToUse[index]) { 
                case "{user.name}": { 
                    console.log("The value of {user.name} is not supported yet."); 
                    newName = newName.replace(regEx, "N/A"); 
                    break; 
                } 
                case "{board.name}": {
                    newName = newName.replace(regEx, item.board.name);  
                    break; 
                } 
                case "{pulse.group}": { 
                    newName = newName.replace(regEx, item.group.title); 
                    break; 
                 } 
                 case "{pulse.name}": { 
                    newName = newName.replace(regEx, item.name); 
                    break; 
                 } 
                default: { 
                    for (let itemColumnIndex in item.column_values) {
                        if (item.column_values[itemColumnIndex].id === this.getColumnIdFromCode(regEx.toString())) {
                            newName = newName.replace(regEx, item.column_values[itemColumnIndex].text); 
                        }
                    }
                    break; 
                } 
             } 
        }

        //Updating Monday item's name
        await mondayRepo.changeSimpleColumnValue(boardId, itemId, "name", newName);

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
  }

  /**
    * {board.name}${pulse.group}--{pulse.number5}/{pulse.text2}
    * RETURNS
    * [{board.name}, {pulse.group}, {pulse.number5}, {pulse.text2}]
    */
  private parseNameStructure(itemNameStructure: string): string[] {
    const regEx = new RegExp("{([^{]*?)}", 'g');
    const valuesList = itemNameStructure.match(regEx);
    let valuesToReturn: string[] = [];

    for (let index in valuesList) {
        valuesToReturn.push(valuesList[index]);
    }

    return valuesToReturn;
  }

  /**
    * {pulse.number5}
    * RETURNS
    * number5
    */
  private getColumnIdFromCode(code: string): string {
    const columnId = code.substring(code.indexOf('.')+1, code.lastIndexOf('}'));
    return columnId;
  }
}

export default new MondayService;
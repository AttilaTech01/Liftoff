import mondayRepo from '../repositories/monday-repository';

interface IMondayService {
    updateItemName(boardId: number, itemId: number, value: string): Promise<boolean>;
}

class MondayService implements IMondayService {
  async updateItemName(boardId: number, itemId: number, value: string): Promise<boolean> { 
    try {  
        //Get infos from item
        await mondayRepo.getItemInformations(itemId);

        //Updating Monday item's name
        await mondayRepo.changeSimpleColumnValue(boardId, itemId, "name", value);

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
  }
}

export default new MondayService;
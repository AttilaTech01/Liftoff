import { Item } from '../Item';
import { ItemInformationResponse, ItemInformationResponseConverter } from '../ItemInformationResponse';
import MockItemInformationResponse from '../__mocks__/ItemInformationResponse';

const mockItemInfoResponse: ItemInformationResponse = MockItemInformationResponse.mockValidItemInformationResponse(); 

describe('convertToItemArray', () => {
    test('ReceivesItemInformationResponse_ReturnsItemArray', async () => {
        //Arrange
        const itemArray: Item[] = mockItemInfoResponse.data.items;

        //Act
        const result: Item[] = await ItemInformationResponseConverter.convertToItemArray(mockItemInfoResponse);

        //Assert
        expect(result).toStrictEqual(itemArray);
    });
});
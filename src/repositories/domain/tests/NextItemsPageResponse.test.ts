import { ItemsPage } from '../ItemsPage';
import { NextItemsPageResponse, NextItemsPageResponseConverter } from '../NextItemsPageResponse';
import MockNextItemsPageResponse from '../__mocks__/NextItemsPageResponse';

const mockNextItemsPageResponse: NextItemsPageResponse = MockNextItemsPageResponse.mockValidNextItemsPageResponse(); 

describe('convertToItemArray', () => {
    test('ReceivesItemInformationResponse_ReturnsItemArray', async () => {
        //Arrange
        const itemsPage: ItemsPage = mockNextItemsPageResponse.data.next_items_page;

        //Act
        const result: ItemsPage = NextItemsPageResponseConverter.convertToItemsPage(mockNextItemsPageResponse);

        //Assert
        expect(result).toStrictEqual(itemsPage);
    });
});
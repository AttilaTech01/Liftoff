import { ItemsPage } from '../ItemsPage';
import { ItemsPageByColumnValuesResponse, ItemsPageByColumnValuesResponseConverter } from '../ItemsPageByColumnValuesResponse';
import MockItemsPageByColumnValuesResponse from '../__mocks__/ItemsPageByColumnValuesResponse';

const mockItemsPageResponse: ItemsPageByColumnValuesResponse = MockItemsPageByColumnValuesResponse.mockValidItemsPageByColumnValuesResponse(); 

describe('convertToItemArray', () => {
    test('ReceivesItemInformationResponse_ReturnsItemArray', async () => {
        //Arrange
        const itemsPage: ItemsPage = mockItemsPageResponse.data.items_page_by_column_values;

        //Act
        const result: ItemsPage = ItemsPageByColumnValuesResponseConverter.convertToItemsPage(mockItemsPageResponse);

        //Assert
        expect(result).toStrictEqual(itemsPage);
    });
});
import Utilities from '../utilities';

describe('transformStringsWithDigitsIntoNumbers', () => {
    test('ReceivesStringArray_ReturnsTrimmedNumberArray', async () => {
        //Arrange

        //Act
        const result1: number[] = Utilities.transformStringsWithDigitsIntoNumbers(['0023','000003','0000002','0012']);
        const result2: number[] = Utilities.transformStringsWithDigitsIntoNumbers(['0023','000003','0Hello','12','12Test45','Te45st','345000','World!']);

        //Assert
        expect(result1).toStrictEqual([23,3,2,12]);
        expect(result2).toStrictEqual([23,3,12,345000]);
    });
});

describe('transformNumberIntoStringWithDigits', () => {
    test('ReceivesNumberAndDigits_ReturnsFormattedString', async () => {
        //Arrange

        //Act
        const result1: string = Utilities.transformNumberIntoStringWithDigits(12,5);
        const result2: string = Utilities.transformNumberIntoStringWithDigits(456,3);
        const result3: string = Utilities.transformNumberIntoStringWithDigits(456,1);
        const result4: string = Utilities.transformNumberIntoStringWithDigits(456,-12);

        //Assert
        expect(result1).toStrictEqual('00012');
        expect(result2).toStrictEqual('456');
        expect(result3).toStrictEqual('456');
        expect(result4).toStrictEqual('456');
    });
});
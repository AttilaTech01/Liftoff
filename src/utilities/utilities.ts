class Utilities {
    /**
    * ['0023','000003','0000002','0012']
    * RETURNS
    * [23,3,2,12]
    */
    transformStringsWithDigitsIntoNumbers = (stringList: string[]): number[] => {
        const numbersToReturn: number[] = [];
        
        for(let str of stringList) {
            if(this.isNumeric(str)) {
                numbersToReturn.push(Number(str));
            }
        }

        return numbersToReturn; 
    };

    /**
    * 23
    * RETURNS
    * "0023"
    */
    transformNumberIntoStringWithDigits = (value: number, neededNumberOfDigits: number): string => {
        let currentNumberOfDigits: number = this.numberOfDigits(value);
        let stringToReturn: string = value.toString();

        while (currentNumberOfDigits < neededNumberOfDigits) {
            stringToReturn = 0 + stringToReturn;
            currentNumberOfDigits++;
        }

        return stringToReturn; 
    };

    /**
    * "10" || "123.78" || "test"
    * RETURNS
    * true || true || false
    */
    private isNumeric(value: string): boolean {
        const maybeNumber: number = Number(value);
        return !isNaN(+maybeNumber);
    }

    /**
    * 23
    * RETURNS
    * 2
    */
    private numberOfDigits = (value: number): number => {
        let result = 0;

        while (value > 0) {
            value = Math.floor(value / 10);
            result++;
        }

        return result;
    };
}

export default new Utilities; 
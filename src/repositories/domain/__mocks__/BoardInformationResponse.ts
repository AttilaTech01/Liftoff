//domain
import { BoardInformationResponse } from '../BoardInformationResponse';
//mocks
import MockBoard from './Board';

class MockBoardInformationResponse {
    mockValidBoardInformationResponse = (): BoardInformationResponse => {
        return ({
            data: {
                boards: [MockBoard.mockValidBoard()],
            },
            account_id: 1234
        });
    };
}

export default new MockBoardInformationResponse;
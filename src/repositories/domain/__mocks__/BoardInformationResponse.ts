//domain
import { BoardInformationResponse } from '../BoardInformationResponse';
//mocks
import MockBoard from './Board';

export class MockBoardInformationResponse {
    mockValidBoardInformationResponse = (): BoardInformationResponse => {
        return ({
            data: {
                boards: [MockBoard.mockValidBoard()],
            },
            account_id: 1234
        });
    };
}
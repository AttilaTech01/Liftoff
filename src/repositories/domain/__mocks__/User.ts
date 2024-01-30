import { User } from '../User';

class MockUser {
    mockValidUser = (): User => {
        return ({
            name: 'name'
        });
    };
}

export default new MockUser;
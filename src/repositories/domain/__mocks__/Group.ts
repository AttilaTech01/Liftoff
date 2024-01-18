import { Group } from '../Group';

class MockGroup {
    mockValidGroup = (): Group => {
        return ({
            title: 'title',
        });
    };
}

export default new MockGroup;
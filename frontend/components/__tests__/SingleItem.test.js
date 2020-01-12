import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import {fakeItem} from "../../lib/testUtils";
import SingleItem, {SINGLE_ITEM_QUERY} from "../SingleItem";

describe('<SingleItem/>', () => {
	it('renders with proper data', async () => {
		const mocks = [
			{
				request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
				result: {
					data: {
						item: fakeItem(),
					},
				},
			},
		];
		const wrapper = mountWrapper(mocks);
		expect(wrapper.text()).toContain('Loading...');
		await wait();
		wrapper.update();
		expect(wrapper.find('h2').exists()).toBe(true);
		expect(wrapper.find('img').exists()).toBe(true);
		expect(wrapper.find('p').exists()).toBe(true);
	});

	it('Errors with a not found item', async () => {
		const mocks = [
			{
				request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
				result: {
					errors: [{ message: 'Items Not Found!' }],
				},
			},
		];
		const wrapper = mountWrapper(mocks);
		await wait();
		wrapper.update();
		const item = wrapper.find('[data-test="graphql-error"]');
		expect(item.text()).toContain('Items Not Found!');
	});
});

function mountWrapper(mocks) {
	return mount(
		<MockedProvider mocks={mocks}>
			<SingleItem id="123" />
		</MockedProvider>
	)
}

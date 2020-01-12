import { mount } from 'enzyme';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from '@apollo/react-testing';
import Pagination, {PAGINATION_QUERY} from "../Pagination";

Router.router = {
	push() {},
	prefetch() {},
};

function makeMocksFor(length) {
	return [
		{
			request: { query: PAGINATION_QUERY },
			result: {
				data: {
					itemsConnection: {
						__typename: 'aggregate',
						aggregate: {
							count: length,
							__typename: 'count',
						},
					},
				},
			},
		},
	];
}

describe('<Pagination/>', () => {
	it('displays a loading message', () => {
		const wrapper = mountWrapper();
		const pagination = wrapper.find(Pagination);
		
		expect(pagination.text()).toContain('Loading...');
	});

	it('renders pagination for 18 items', async () => {
		const wrapper = mountWrapper(18);
		await wait();
		wrapper.update();
		
		const pagination = wrapper.find(Pagination);
		expect(pagination.find('.totalPages').text()).toEqual('5');
	});

	it('disables prev button on first page', async () => {
		const wrapper = mountWrapper(18);
		await wait();
		wrapper.update();
		
		expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
		expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
	});
	it('disables next button on last page', async () => {
		const wrapper = mountWrapper(18, 5);
		await wait();
		wrapper.update();
		
		expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
		expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
	});
	it('enables all buttons on a middle page', async () => {
		const wrapper = mountWrapper(18, 3);
		await wait();
		wrapper.update();
		
		expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
		expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(false);
	});
});

function mountWrapper(mocksCount = 1, pagesCount = 1) {
	return mount(
		<MockedProvider mocks={makeMocksFor(mocksCount)}>
			<Pagination page={pagesCount} />
		</MockedProvider>
	)
}

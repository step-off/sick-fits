import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import {Nav} from "../Nav";
import {CURRENT_USER_QUERY} from "../User";
import {fakeCartItem, fakeUser} from "../../lib/testUtils";

const notSignedInMocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: { data: { me: null } },
	},
];

const signedInMocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: { data: { me: fakeUser() } },
	},
];

const signedInMocksWithCartItems = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: {
			data: {
				me: {
					...fakeUser(),
					cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
				},
			},
		},
	},
];

describe('<Nav/>', () => {
	it('renders a minimal nav when signed out', async () => {
		const wrapper = mountWrapper(notSignedInMocks);

		await wait();
		wrapper.update();

		const nav = wrapper.find('ul[data-test="nav"]');
		expect(nav.children().length).toBe(2);
		expect(nav.text()).toContain('Sign In');
	});

	it('renders full nav when signed in', async () => {
		const wrapper = mountWrapper(signedInMocks);
		await wait();

		wrapper.update();
		const nav = wrapper.find('ul[data-test="nav"]');

		expect(nav.children().length).toBe(6);
		expect(nav.text()).toContain('Sign Out');
	});

	it('renders the amount of items in the cart', async () => {
		const wrapper = mountWrapper(signedInMocksWithCartItems);

		await wait();
		wrapper.update();

		const nav = wrapper.find('[data-test="nav"]');
		const count = nav.find('div.count');
		const expected = signedInMocksWithCartItems[0].result
			.data.me.cart
			.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
		
		expect(count.text()).toContain(expected);
	});
});

function mountWrapper(mocks) {
	return mount(
		<MockedProvider mocks={mocks}>
			<Nav />
		</MockedProvider>
	)
}

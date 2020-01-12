import { mount } from 'enzyme';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import Signup, { SIGNUP_MUTATION } from '../../components/Signup';
import { CURRENT_USER_QUERY } from '../../components/User';
import {fakeUser} from "../../lib/testUtils";

function type(wrapper, name, value) {
	wrapper.find(`input[name="${name}"]`).simulate('change', {
		target: { name, value },
	});
}

const me = fakeUser();
const mocks = [
	{
		request: {
			query: SIGNUP_MUTATION,
			variables: {
				name: me.name,
				email: me.email,
				password: 'wes',
			},
		},
		result: {
			data: {
				signup: {
					__typename: 'User',
					id: 'abc123',
					email: me.email,
					name: me.name,
				},
			},
		},
	},
	{
		request: { query: CURRENT_USER_QUERY },
		result: { data: { me } },
	},
];

describe('<Signup/>', () => {
	it('calls the mutation properly', async () => {
		let apolloClient;
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<ApolloConsumer>
					{client => {
						apolloClient = client;
						return <Signup />;
					}}
				</ApolloConsumer>
			</MockedProvider>
		);
		
		type(wrapper, 'name', me.name);
		type(wrapper, 'email', me.email);
		type(wrapper, 'password', 'wes');
		
		wrapper.update();
		wrapper.find('form').simulate('submit');
		
		const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
		expect(user.data.me).toMatchObject(me);
	});
});

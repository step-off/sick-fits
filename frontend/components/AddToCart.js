import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {CURRENT_USER_QUERY} from "./User";

const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID!) {
        addToCart(id: $id) {
            id
            quantity
        }
    }
`;

class AddToCart extends React.Component {
	refetchQueries = [{
		query: CURRENT_USER_QUERY
	}];

	render() {
		const {id} = this.props;
		return (
			<Mutation
				mutation={ADD_TO_CART_MUTATION}
				refetchQueries={this.refetchQueries}
				variables={{
					id,
				}}
			>
				{(addToCart, {loading}) => <button disabled={loading} onClick={addToCart}>
					{`Add${loading ? 'ing' : ''} To Cart 🛒`}
				</button>}
			</Mutation>
		);
	}
}

export default AddToCart;
export {ADD_TO_CART_MUTATION}

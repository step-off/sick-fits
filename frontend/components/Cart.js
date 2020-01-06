import React from 'react';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from "./CartItem";
import User from "./User";
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;

const Cart = () => (
	<User>
		{({data}) => {
			if (data && data.me) {
				const me = data.me;
				return (
					<Mutation
						mutation={TOGGLE_CART_MUTATION}>
						{toggleCart => (
							<Query query={LOCAL_STATE_QUERY}>
								{({data}) => (
									<CartStyles open={data && data.cartOpen}>
										<header>
											<CloseButton onClick={toggleCart} title="close">
												&times;
											</CloseButton>
											<Supreme>Your Cart</Supreme>
											<p>
												You Have {me.cart.length} Item{me.cart.length === 1 ? '' : 's'} in your
												cart.
											</p>
										</header>
										<ul>
											{me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem}/>)}
										</ul>
										<footer>
											<p>{formatMoney(calcTotalPrice(me.cart))}</p>
											<SickButton>Checkout</SickButton>
										</footer>
									</CartStyles>
								)}
							</Query>
						)}
					</Mutation>
				)
			}
			return null;
		}}
	</User>
);

export default Cart;
export {LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION};

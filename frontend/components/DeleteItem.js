import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {ALL_ITEMS_QUERY} from './Items';
import {ApolloConsumer} from 'react-apollo'

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;

class DeleteItem extends Component {
	render() {
		return (
			<ApolloConsumer>
				{client => (
					<Mutation
						mutation={DELETE_ITEM_MUTATION}
						variables={{id: this.props.id}}
						update={this.update.bind(this, client)}
					>
						{(deleteItem, {error}) => (
							<button
								onClick={() => this.handleDeletion(deleteItem)}
							>
								{this.props.children}
							</button>
						)}
					</Mutation>
				)}
			</ApolloConsumer>
		);
	}

	update = (client, cache, payload) => {
		const dataInCache = client.readQuery({query: ALL_ITEMS_QUERY});
		const data = {...dataInCache};
		data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
		client.writeQuery({query: ALL_ITEMS_QUERY, data});
	};

	handleDeletion = (deleteItem) => {
		if (confirm('Are you sure you want to delete this item?')) {
			deleteItem().catch(err => {
				alert(err.message);
			});
		}
	};
}

export default DeleteItem;

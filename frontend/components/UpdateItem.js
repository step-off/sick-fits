import React, {Component} from 'react';
import {Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;
const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION($id: ID!, $data: ItemUpdateInput!) {
        updateItem(id: $id, data: $data) {
            id
            title
            description
            price
        }
    }
`;

class UpdateItem extends Component {
	state = {};
	singleItemQueryVariables = {
		id: this.props.id,
	};

	render() {
		return (
			<Query
				query={SINGLE_ITEM_QUERY}
				variables={this.singleItemQueryVariables}
			>
				{({data, loading}) => {
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No Item Found for ID {this.props.id}</p>;
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION}>
							{(updateItem, {loading, error}) => (
								<Form onSubmit={this.handleSubmit.bind(this, updateItem)}>
									<Error error={error}/>
									<fieldset disabled={loading} aria-busy={loading}>
										<label htmlFor="title">
											Title
											<input
												type="text"
												id="title"
												name="title"
												placeholder="Title"
												required
												defaultValue={data.item.title}
												onChange={this.handleChange}
											/>
										</label>

										<label htmlFor="price">
											Price
											<input
												type="number"
												id="price"
												name="price"
												placeholder="Price"
												required
												defaultValue={data.item.price}
												onChange={this.handleChange}
											/>
										</label>

										<label htmlFor="description">
											Description
											<textarea
												id="description"
												name="description"
												placeholder="Enter A Description"
												required
												defaultValue={data.item.description}
												onChange={this.handleChange}
											/>
										</label>
										<button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}

	handleChange = e => {
		const {name, type, value} = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({[name]: val});
	};

	handleSubmit = async (updateItemMutation, e) => {
		e.preventDefault();
		await updateItemMutation({
			variables: {
				data: {
					...this.state,
				},
				id: this.props.id,
			},
		});
	};
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION};

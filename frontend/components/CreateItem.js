import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION($data: ItemCreateInput!) {
        createItem(data: $data) {
            id
            title
            price
        }
    }
`;

class CreateItem extends Component {
	state = {
		title: 'Cool Shoes',
		description: 'I love those shoes',
		image: 'image.jpg',
		largeImage: 'large-image.jpg',
		price: 1000,
	};

	render() {
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION}>
				{(createItem, {loading, error}) => (
					<Form
						onSubmit={this.handleSubmit.bind(this, createItem)}
					>
						{error && <Error error={error}/>}
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor="title">
								Title
								<input
									type="text"
									id="title"
									name="title"
									placeholder="Title"
									required
									value={this.state.title}
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
									value={this.state.price}
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
									value={this.state.description}
									onChange={this.handleChange}
								/>
							</label>
							<button type="submit">Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}

	handleChange = e => {
		const {name, type, value} = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({[name]: val});
	};

	handleSubmit = async (createItem, e) => {
		// Stop the form from submitting
		e.preventDefault();
		// call the mutation
		const res = await createItem({
			variables: {
				data: this.getStateSnapshot()
			}
		});
		// change them to the single item page
		Router.push({
			pathname: '/item',
			query: {id: res.data.createItem.id},
		});
	};

	getStateSnapshot = () => {
		return {
			...this.state
		}
	};
}

export default CreateItem;
export {CREATE_ITEM_MUTATION};

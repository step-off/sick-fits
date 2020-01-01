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
		image: '',
		largeImage: '',
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
							<label htmlFor="file">
								Image
								<input
									type="file"
									id="file"
									name="file"
									placeholder="Upload an image"
									required
									onChange={this.uploadFile}
								/>
								{this.state.image && (
									<img width="200" src={this.state.image} alt="Upload Preview"/>
								)}
							</label>

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

	uploadFile = async e => {
		const files = e.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'sickfits');

		const res = await fetch('https://api.cloudinary.com/v1_1/dkid75lvm/image/upload', {
			method: 'POST',
			body: data,
		});
		const file = await res.json();
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url,
		});
	};

	handleSubmit = async (createItem, e) => {
		e.preventDefault();
		const res = await createItem({
			variables: {
				data: this.getStateSnapshot()
			}
		});
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

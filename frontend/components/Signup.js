import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
            id
            email
            name
        }
    }
`;

class Signup extends Component {
	state = {
		name: '',
		password: '',
		email: '',
	};

	render() {
		return (
			<Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
				{(signup, {error, loading}) => (
					<Form
						method="post"
						onSubmit={(e) => this.handleSubmit(e, signup)}
					>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Sign Up for An Account</h2>
							<Error error={error}/>
							<label htmlFor="email">
								Email
								<input
									type="email"
									name="email"
									placeholder="email"
									value={this.state.email}
									onChange={this.saveToState}
								/>
							</label>
							<label htmlFor="name">
								Name
								<input
									type="text"
									name="name"
									placeholder="name"
									value={this.state.name}
									onChange={this.saveToState}
								/>
							</label>
							<label htmlFor="password">
								Password
								<input
									type="password"
									name="password"
									placeholder="password"
									value={this.state.password}
									onChange={this.saveToState}
								/>
							</label>
							<button type="submit">Sign Up!</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}

	handleSubmit = async (e, singupMutation) => {
		e.preventDefault();
		await singupMutation();
		this.setState({name: '', email: '', password: ''});
	};

	saveToState = e => {
		this.setState({[e.target.name]: e.target.value});
	};
}

export default Signup;

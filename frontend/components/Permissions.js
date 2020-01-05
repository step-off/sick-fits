import {Query, Mutation} from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
	'ADMIN',
	'USER',
	'ITEMCREATE',
	'ITEMUPDATE',
	'ITEMDELETE',
	'PERMISSIONUPDATE',
];
const UPDATE_USER_PERMISSIONS_MUTATION = gql`
    mutation updateUserPermissions($userId: ID!, $permissions: [Permission]) {
        updateUserPermissions(userId: $userId, permissions: $permissions) {
            id
            permissions
            name
            email
        }
    }
`;

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => (
	<Query query={ALL_USERS_QUERY}>
		{({data, loading, error}) => (
			<div>
				<Error error={error}/>
				<div>
					<h2>Manage Permissions</h2>
					<Table>
						<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							{possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
							<th>👇🏻</th>
						</tr>
						</thead>
						{data && <tbody>{data.users.map(user => <User key={user.id} user={user}/>)}</tbody>}
					</Table>
				</div>
			</div>
		)}
	</Query>
);

class User extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			name: PropTypes.string,
			email: PropTypes.string,
			id: PropTypes.string,
			permissions: PropTypes.array,
		}).isRequired,
	};

	state = {
		permissions: this.props.user.permissions
	};

	render() {
		const user = this.props.user;
		return (
			<Mutation
				mutation={UPDATE_USER_PERMISSIONS_MUTATION}
				variables={{
					permissions: this.state.permissions,
					userId: this.props.user.id,
				}}
			>
				{(updateUserPermissionsMutation, {loading, error}) => (
					<tr>
						{error && <Error error={error}/>}
						<td>{user.name}</td>
						<td>{user.email}</td>
						{possiblePermissions.map(permission => (
							<td key={permission}>
								<label htmlFor={`${user.id}-permission-${permission}`}>
									<input
										id={`${user.id}-permission-${permission}`}
										checked={this.state.permissions.includes(permission)}
										value={permission}
										onChange={this.handlePermissionChange}
										type="checkbox"
									/>
								</label>
							</td>
						))}
						<td>
							<SickButton
								onClick={updateUserPermissionsMutation}
								disabled={loading}
								type={'button'}
							>Update
							</SickButton>
						</td>
					</tr>
				)}
			</Mutation>
		);
	}

	handlePermissionChange = e => {
		const checkbox = e.target;
		let updatedPermissions = [...this.state.permissions];
		if (checkbox.checked) {
			updatedPermissions.push(checkbox.value);
		} else {
			updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
		}
		this.setState({permissions: updatedPermissions});
	};
}

export default Permissions;

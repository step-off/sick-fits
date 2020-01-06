import React from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import {ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
            id
            image
            title
        }
    }
`;

class AutoComplete extends React.Component {
	state = {
		items: [],
		loading: false,
	};

	render() {
		return (
			<SearchStyles>
				<Downshift onChange={this.routeToItem} itemToString={item => (item === null ? '' : item.title)}>
					{({getInputProps, getItemProps, isOpen, inputValue, highlightedIndex}) => {
						return (
							<div>
								<ApolloConsumer>
									{client => (
										<input
											{...getInputProps({
												type: 'search',
												placeholder: 'Search For An Item',
												id: 'search',
												className: this.state.loading ? 'loading' : '',
												onChange: e => {
													e.persist();
													this.handleChange(e, client);
												},
											})}
										/>
									)}
								</ApolloConsumer>
								{isOpen && (
									<DropDown>
										{this.state.items.map((item, index) => (
											<DropDownItem
												{...getItemProps({item})}
												key={item.id}
												highlighted={index === highlightedIndex}
											>
												<img width="50" src={item.image} alt={item.title}/>
												{item.title}
											</DropDownItem>
										))}
										{!this.state.items.length &&
										!this.state.loading && <DropDownItem> Nothing Found {inputValue}</DropDownItem>}
									</DropDown>
								)}
							</div>
						)
					}}
				</Downshift>

			</SearchStyles>
		);
	}

	handleChange = debounce(async (e, client) => {
		const searchTerm = e.target.value;
		if (!searchTerm) return;

		this.setState({loading: true});
		const res = await client.query({
			query: SEARCH_ITEMS_QUERY,
			variables: {searchTerm},
		});
		this.setState({
			items: res.data.items,
			loading: false,
		});
	}, 350);

	routeToItem = (item) => {
		Router.push({
			pathname: '/item',
			query: {
				id: item.id,
			},
		});
	}
}

export default AutoComplete;

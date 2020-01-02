import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from "./DeleteItem";

export default class Item extends Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
	};
	itemHref = {
		pathname: '/item',
		query: {id: this.props.item.id}
	};
	updateHref = {
		pathname: '/update',
		query: {id: this.props.item.id}
	};

	render() {
		const {item} = this.props;
		return (
			<ItemStyles>
				{item.image && <img src={item.image} alt={item.title}/>}
				<Title>
					<Link
						href={this.itemHref}
					>
						<a>{item.title}</a>
					</Link>
				</Title>
				<PriceTag>{formatMoney(item.price)}</PriceTag>
				<p>{item.description}</p>

				<div className="buttonList">
					<Link
						href={this.updateHref}
					>
						<a>Edit ✏</a>
					</Link>
					<button>Add To Cart</button>
					<DeleteItem id={item.id}>Delete This Item</DeleteItem>
				</div>
			</ItemStyles>
		);
	}
}

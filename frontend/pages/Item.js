import SingleItem from '../components/SingleItem';

const Item = props => (
	<div>
		<SingleItem id={props.pageProps.query.id} />
	</div>
);

export default Item;

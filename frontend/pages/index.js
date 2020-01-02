import Items from '../components/Items';

const Home = props => (
	<div>
		<Items page={parseFloat(props.pageProps.query.page) || 1} />
	</div>
);

export default Home;

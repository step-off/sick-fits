import UpdateItem from '../components/UpdateItem';

const Update = ({pageProps}) => {
	return (
		<div>
			<UpdateItem id={pageProps.query.id}/>
		</div>
	)
};

export default Update;

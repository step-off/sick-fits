import CreateItem from '../components/CreateItem';
import RequestSingin from "../components/RequestSingin";

const Sell = props => (
	<div>
		<RequestSingin>
			<CreateItem/>
		</RequestSingin>
	</div>
);

export default Sell;

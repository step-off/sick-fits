import App from 'next/app';
import Page from "./Page";

export class MyApp extends App {
	render() {
		const {Component, ...rest} = this.props;

		return <React.Fragment>
			<Page>
				<Component {...rest}/>
			</Page>
		</React.Fragment>
	}
}

export default MyApp;

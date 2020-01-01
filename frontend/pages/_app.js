import App from 'next/app';
import {ApolloProvider} from 'react-apollo'
import Page from "./Page";
import withData from "../lib/withData";

export class MyApp extends App {
	static async getInitialProps({Component, ctx}) {
		let pageProps = {}
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		
		pageProps.query = ctx.query;
		return {pageProps}
	}
	
	render() {
		const {Component, apollo, ...rest} = this.props;

		return <ApolloProvider client={apollo}>
			<Page>
				<Component {...rest}/>
			</Page>
		</ApolloProvider>
	}
}

export default withData(MyApp);

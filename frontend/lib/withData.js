import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, {client}) {
            const { cartOpen } = client.readQuery({
              query: LOCAL_STATE_QUERY,
            });
            const data = {
              data: { cartOpen: !cartOpen },
            };
            client.writeData(data);
            return data;
          },
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

export default withApollo(createClient);

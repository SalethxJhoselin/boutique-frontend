import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Link de errores
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// Link HTTP
const httpLink = new HttpLink({
  //uri: 'http://localhost:3001/graphql',
  uri: 'https://boutique-back-api.onrender.com/graphql',
  credentials: 'include',
});

// Link para agregar token a headers
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

// Crear cliente
const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

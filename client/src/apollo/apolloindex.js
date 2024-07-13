import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    InMemoryCache,
    Observable,
  } from "@apollo/client";
  import userAtom from '../atoms/userAtom.js';
  import { useRecoilValue } from 'recoil';
  import { setContext } from '@apollo/client/link/context';
  const setupApolloClient = () => {
    
    const httpLink = createHttpLink({
      uri: `${import.meta.env.REACT_APP_SERVER_URL}`,
    });
    
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('token');
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    });
    
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    return client
  }

//   const setupApolloClient = () => {
//     console.log(' userAtom :',userAtom)
//     const user = useRecoilValue(userAtom);
//     const cache = new InMemoryCache();
//     const httpLink = createHttpLink({
//       uri: `${process.env.REACT_APP_SERVER_URL}`,
//       // uri: `${process.env.REACT_APP_TEST_SERVER_URL}`,
//     });
  
//     const request = async (operation) => {
     
//       console.log("🚀 ~ request ~ user:", user)
//       operation.setContext({
//         headers: {
//           Authorization: user?.jwtToken ? `Bearer ${user?.jwtToken}` : "",
//         },
//       });
//     };
  
//     const requestLink = new ApolloLink(
//       (operation, forward) =>
//         new Observable((observer) => {
//           let handle;
//           Promise.resolve(operation)
//             .then((oper) => request(oper))
//             // .then(() => {
//             //   handle = forward(operation).subscribe({
//             //     next: observer.next.bind(observer),
//             //     error: observer.error.bind(observer),
//             //     complete: observer.complete.bind(observer),
//             //   });
//             // })
//             .catch(observer.error.bind(observer));
  
//           return () => {
//             if (handle) handle.unsubscribe();
//           };
//         })
//     );
  
//     const client = new ApolloClient({
//       link: ApolloLink.from([requestLink, httpLink]),
//       cache,
//       resolvers: {},
//       defaultOptions: {
//         watchQuery: {
//           fetchPolicy: 'no-cache',
//         },
//         query: {
//           fetchPolicy: 'no-cache',
//         },
//       },
//       connectToDevTools: true,
//     });
//     console.log('setupApolloClient: client ',client)
//     return client;
//   };
  
  export default setupApolloClient;
  
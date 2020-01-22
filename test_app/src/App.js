import React, { useState } from 'react';
import ApolloBoostClient, { gql, ApolloClient, InMemoryCache } from 'apollo-boost';
import { BatchHttpLink } from "apollo-link-batch-http"

const clientBoostClient = new ApolloBoostClient({ uri: '/graphql' })

const clientWithBatching = new ApolloClient({
  cache: new InMemoryCache(),
  link: new BatchHttpLink({ uri: "/graphql" })
})

function App() {
  const [people, setPeople] = useState([])

  const onFetch = () => {
    window.fetch({
      url: '/graphql',
      method: 'POST',
      body: JSON.stringify({
        query: "{ people { firstname surname } }"
      })
    })
      .then(res => res.json())
      .then(({ data: { people } }) => {
        setPeople(people)
      })
  }

  const onFetchWithCustomEndpoint = () => {
    window.fetch({
      url: '/gql',
      method: 'POST',
      body: JSON.stringify({
        query: "{ people { firstname surname } }"
      })
    })
      .then(res => res.json())
      .then(({ data: { people } }) => {
        setPeople(people)
      })
  }

  const onApollo = () => {
    clientBoostClient.query({
      query: gql`
          query GetPeople {
            people {
              firstname
              surname
            }
          }
        `
    })
      .then(({ data: { people } }) => {
        setPeople(people)
      })
  }

  const onApolloBatch = () => {
    clientWithBatching.query({
      query: gql`
          query GetPeople {
            people {
              firstname
              surname
            }
          }
        `
    })
      .then(({ data: { people }, errors }) => {
        setPeople(people)
        console.log('ERROR', errors)
      })
      .catch(error => console.log('ERROR', error))
  }

  return (
    <div className="App">
      <h1>Cy Mock GraphQL Test App</h1>
      <button onClick={onFetch}>Fetch</button>
      <button onClick={onFetchWithCustomEndpoint}>Fetch with custom endpoint</button>
      <button onClick={onApollo}>Apollo</button>
      <button onClick={onApolloBatch}>Apollo Batch</button>
      {people.map(({ firstname, surname }, i) => <div key={i}>{firstname} {surname}</div>)}
    </div>
  );
}

export default App;

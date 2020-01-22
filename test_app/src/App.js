import React, { useState } from 'react';
import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({ uri: '/graphql' })

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
    client.query({
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

  return (
    <div className="App">
      <h1>Cy Mock GraphQL Test App</h1>
      <button onClick={onFetch}>Fetch</button>
      <button onClick={onFetchWithCustomEndpoint}>Fetch with custom endpoint</button>
      <button onClick={onApollo}>Apollo</button>
      {people.map(({ firstname, surname }, i) => <div key={i}>{firstname} {surname}</div>)}
    </div>
  );
}

export default App;

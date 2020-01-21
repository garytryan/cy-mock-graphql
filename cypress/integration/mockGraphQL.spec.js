import { buildSchema, graphqlSync, introspectionQuery } from 'graphql'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'


const schema = `
type Person {
  firstname: String!
  surname: String!
}

type Query {
  people: [Person]
}
`

const introspection = graphqlSync(buildSchema(schema), introspectionQuery)

const mock = {
  Query: () => ({
    people: () => ([
      {
        firstname: 'Gary',
        surname: 'Ryan',
      }
    ])
  })
}

const fetchPerson = () =>
  fetch({
    url: '/graphql',
    method: 'POST',
    body: JSON.stringify({
      query: "{ people { firstname surname } }"
    })
  })
    .then(res => res.json())

describe('Accepts schema string', () => {
  beforeEach(() => cy.mockGraphQL(schema, mock))

  it('is ok', async () => {
    const response = await fetchPerson()

    expect(response).to.deep.equal({
      data: {
        people: [{
          firstname: 'Gary',
          surname: 'Ryan',
        }]
      }
    })
  })
})

describe('Accepts introspection result', () => {
  beforeEach(() => cy.mockGraphQL(introspection, mock))

  it('is ok', async () => {
    const response = await fetchPerson()

    expect(response).to.deep.equal({
      data: {
        people: [{
          firstname: 'Gary',
          surname: 'Ryan'
        }]
      }
    })
  })
})

describe('Accepts endpoint option', () => {
  beforeEach(() => cy.mockGraphQL(introspection, mock, { endpoint: '/gql' }))

  it('is ok', async () => {
    const response = await fetch({
      url: '/gql',
      method: 'POST',
      body: JSON.stringify({
        query: "{ people { firstname surname } }"
      })
    })
      .then(res => res.json())

    expect(response).to.deep.equal({
      data: {
        people: [{
          firstname: 'Gary',
          surname: 'Ryan'
        }]
      }
    })
  })

})

describe('Supports Apollo', () => {
  beforeEach(() => cy.mockGraphQL(schema, mock))


  it('is ok', async () => {
    const client = new ApolloClient()

    const response = await client.query({
      query: gql`
        query GetPeople {
          people {
            firstname
            surname
          }
        }
      `
    })

    expect(response.data).to.deep.equal({
      people: [{
        __typename: 'Person',
        firstname: 'Gary',
        surname: 'Ryan'
      }]
    })
  })
})
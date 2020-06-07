# Cypress Mock GraphQL

## Installation
```
npm install cy-mock-graphql
```
```
yarn add cy-mock-graphql
```

### Usage
#### schema.gql
```
type Person {
  firstname: String!
  surname: String!
}

type Query {
  people: [Person]
}
```

#### myCypressTest.spec.js
```
import mockGraphQL from 'cy-mock-graphql'
import schema from 'schema.gql'

describe('My Cypress Test', () => {
  beforeEach(() => {
    cy.mockGraphQL(schema, {
      Query: {
        people: () => ([
          {
            firstname: 'Gary',
            surname: 'Ryan'
          }
        ])
      }
    })
  })

  it('Should mock graphql', () => {
    ...
  })
})
```

### API
mockGraphQL(schema, mock, options)

#### Schema
 - Required
 - Types:
   - [SDL](https://graphql.org/learn/schema/) (Schema Definition Language), String
   - [Introspection Query Result](https://graphql.org/learn/introspection/), Object

#### Mock
  - Optional
  - Type: Object with resolver functions, see example in usage section.

#### Options
  ```
    {
      endpoint: String | default '/graphql'
    }
  ```

  - endpoint: specifiy the graphql endpoint

## Contributing

    git clone ...

    yarn
    yarn ci

#### License
MIT

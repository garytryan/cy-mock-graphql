import { buildSchema, graphqlSync, introspectionQuery } from 'graphql'
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


describe('Accepts schema string', () => {
  beforeEach(() => cy.mockGraphQL(schema, mock))

  it('is ok', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Fetch').click()
    cy.contains('Gary Ryan')
  })
})

describe('Accepts introspection result', () => {
  beforeEach(() => cy.mockGraphQL(introspection, mock))

  it('is ok', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Fetch').click()
    cy.contains('Gary Ryan')
  })
})

describe('Specify a custom endpoint', () => {
  beforeEach(() => cy.mockGraphQL(introspection, mock, { endpoint: '/gql' }))

  it('is ok', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Fetch with custom endpoint').click()
    cy.contains('Gary Ryan')
  })
})

describe('Supports Apollo', () => {
  beforeEach(() => cy.mockGraphQL(schema, mock))

  it('is ok', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Apollo').click()
    cy.contains('Gary Ryan')
  })
})

describe('Supports Apollo Batch', () => {
  beforeEach(() => cy.mockGraphQL(schema, mock))

  it('is ok', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Apollo Batch').click()
    cy.contains('Gary Ryan')
  })
})

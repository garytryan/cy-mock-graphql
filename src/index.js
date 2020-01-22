
const { mockServer } = require('graphql-tools')
const { buildClientSchema } = require('graphql')

const mockGraphQL = (win, schema, mock, options) => {
  const originalFetch = window.fetch

  const fetch = (...args) => {
    let url = ''
    let method = ''
    let body

    if (typeof args[0] === 'string') {
      url = args[0]

      if (args[1]) {
        method = args[1].method || 'POST'
        body = args[1].body
      }
    } else {
      url = args[0].url
      method = args[0].method || 'POST'
      body = args[0].body
    }

    if (
      url === options.endpoint &&
      method === 'POST'
    ) {

      const query = JSON.parse(body).query

      if (
        typeof schema === 'object' &&
        schema.hasOwnProperty('data')
      ) {
        schema = buildClientSchema(schema.data)
      }

      return mockServer(schema, mock)
        .query(query)
        .then(result => ({
          json: () => Promise.resolve(result),
          text: () => Promise.resolve(JSON.stringify(result)),
          ok: true
        }))

    }

    return originalFetch.apply(null, args)
  }

  if (win.fetch.restore) {
    win.fetch.restore()
  }

  cy.stub(win, 'fetch', fetch).as('mockGraphQL')
}

Cypress.Commands.add('mockGraphQL', (schema, mock = {}, options = { endpoint: '/graphql' }) => {
  Cypress.on('window:before:load', win => mockGraphQL(win, schema, mock, options))
})


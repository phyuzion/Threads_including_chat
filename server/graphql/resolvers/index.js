const userResolver = require('./user')
const postResolver = require('./post')
const messageResolver = require('./message')

const rootResolver = {
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
    ...messageResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...messageResolver.Mutation
  },

}

module.exports = rootResolver

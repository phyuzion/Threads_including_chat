const userResolver = require('./user')
const postResolver = require('./post')
const messageResolver = require('./message')

const rootResolver = {
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
    ...messageResolver.Query,
    ...adminResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...messageResolver.Mutation,
    ...adminResolver.Mutation,
  },

}

module.exports = rootResolver

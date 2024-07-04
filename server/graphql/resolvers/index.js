const userResolver = require('./user')
const postResolver = require('./post')

const rootResolver = {
  Query: {
    ...userResolver.Query,
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
  },

}

module.exports = rootResolver

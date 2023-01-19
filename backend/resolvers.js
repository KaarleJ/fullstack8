const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET= 'NEED_ME_A_PROJECT_IDEA'

const resolvers = {
  Query: {
    bookCount: async () => {
      Book.collection.countDocuments()
      console.log('looking for books')
    },
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author})
        const books = await Book.find({ author: author.id }).populate('author')
        return books
      } else if (args.genre) {
        let books = await Book.find({}).populate('author')
        books = books.filter((book) => book.genres.includes(args.genre))
        return books
      }
      const books = await Book.find({}).populate('author')
      return books
    },
    allAuthors: async (root) => {
      return await Author.find({})
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser){
        throw new AuthenticationError('not authenticated')
      }
      const newBook = new Book({...args})
      const authors = await Author.find({})
      let author = null
      if (!authors.map((author) => author.name).includes(args.author)) {
        author = new Author({ name: args.author })
        await author.save()
      } else {
        author = await Author.findOne({ name: args.author })
      }
      newBook.author=author.id
      author.books = author.books.concat(newBook.id)
      try {
        await newBook.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook.populate('author')})

      return newBook.populate('author')
    },
    editAuthor: async (root, args, context) => {
      console.log(context.currentUser)
      if (!context.currentUser){
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        await user.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidargs: args,
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'salasana' ) {
        throw new UserInputError('wrong credentials')
      }
  
      const userForToken = {
        username: user.username,
        id: user._id
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET)}
    },
  },
  Author: {
    bookCount: async (root) => {
      return root.books.length
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  },
}

module.exports = resolvers
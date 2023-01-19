import { gql } from '@apollo/client'

export const ALL_DATA = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
    allBooks {
      author {
        bookCount
        born
        id
        name
      }
      title
      published
      genres
      id
    }
    authorCount
    bookCount
  }
`

export const ALL_BOOKS = gql`
  query ALLBOOKS {
    allBooks {
      author {
        bookCount
        born
        id
        name
      }
      title
      published
      genres
      id
    }
  }
`

export const ALL_AUTHORS = gql`
  query ALLAUTHORS {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const FILTERED = gql`
  query Query($genre: String){
    allBooks(genre: $genre) {
      author {
        bookCount
        born
        id
        name
      }
      genres
      id
      published
      title
    }
  }
`

export const ME = gql`
  query ME {
    me {
      favoriteGenre
    }
  }
`
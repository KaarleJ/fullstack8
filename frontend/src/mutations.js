import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation createbook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      author {
        bookCount
        born
        id
        name
      }
      title
      published
      id
      genres
    }
  }
`

export const EDIT_BIRTH = gql`
  mutation addBirth(
    $name: String!
    $born: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $born
    ) {
      name
      born
      id
    }
  }
`

export const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`
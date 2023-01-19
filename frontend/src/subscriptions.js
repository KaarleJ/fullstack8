import { gql } from '@apollo/client'

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            author {
                born
                bookCount
                name
                id
            }
            genres
            id
            published
            title
        }
    }
`

export const updateCache = (cache, query, addedBook) => {
    const uniqByName = (a) => {
        let seen = new Set()
        return a.filter((item) => {
            let k = item.title
            return seen.has(k) ? false : seen.add(k)
        })
    }

    cache.updateQuery(query, ({ allBooks }) =>  {
        return {
            allBooks: uniqByName(allBooks.concat(addedBook))
        }
    })
}
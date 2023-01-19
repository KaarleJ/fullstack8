import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import Notice from './components/Notice'
import { ALL_BOOKS, ALL_AUTHORS } from './queries'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { BOOK_ADDED, updateCache } from './subscriptions'

const App = () => {
  const [page, setPage] = useState('authors')
  const [ token, setToken] = useState(null)
  const [ notice, setNotice ] = useState(null)
  const client = useApolloClient()
  
  useEffect(() => {
    if (token === null) {
      const cacheToken=localStorage.getItem('user-token')
      setToken(cacheToken)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bookResult = useQuery(ALL_BOOKS)
  const authorResult = useQuery(ALL_AUTHORS)

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      setNotice(`A new book added: ${data.data.bookAdded.title}`)
      setTimeout(() => setNotice(null), 2000)
    }
  })

  if (bookResult.loading || authorResult.loading) {
    return <div>loading...</div>
  }

  const logOut = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setNotice('Logged Out')
    setTimeout(() => setNotice(null), 3000)
  }
  const books=bookResult.data.allBooks
  const authors = authorResult.data.allAuthors

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token === null ? null : <button onClick={() => setPage('recommended')}>recommended</button>}
        {token === null ? null : <button onClick={() => setPage('add')}>add book</button>}
        {token === null ?
        <button onClick={() => setPage('login')}>login</button> :
        <button onClick={() =>{
          setPage('authors')
          logOut()
        }
        }>logout</button>}
      </div>

      <Authors show={page === 'authors'} authors={authors} token={token}/>

      <Books show={page === 'books'} books={books}/>

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setToken={setToken}/>

      <Recommended show={page === 'recommended'} books={books} token={token}/>

      <Notice message={notice} />
    </div>
  )
}

export default App

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { FILTERED } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const { loading, data } = useQuery(FILTERED, {
    variables: {
      genre: filter ? filter : ' ',
    },
  })

  if (loading) {
    return <div>loading</div>
  }

  if (!props.show) {
    return null
  }

  let books = filter ? data.allBooks : props.books

  let genres = books.reduce((current, book) => {
    return current.concat(book.genres)
  }, [])
  genres = [...new Set(genres)]

  return (
    <div>
      <h2>books</h2>
      {filter === '' ? null : (
        <div>
          in genre <b>{filter}</b>
          <button onClick={() => setFilter('')}>reset filter</button>
        </div>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display: filter ? 'none': ''}}>
        <p>filter by genre:</p>
        {genres.map((genre) => {
          return (
            <button key={genre} onClick={() => setFilter(genre)}>
              {genre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Books

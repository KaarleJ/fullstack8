import { useQuery } from '@apollo/client'
import { ME } from '../queries'

const Recommended = (props) => {
  const result = useQuery(ME)
  if (props.token===null) {
    return null
  }
  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading</div>
  }
  if (!result.data.me) {
    return null
  }
  const genre = result.data.me.favoriteGenre
  const books = props.books.filter((book) => book.genres.includes(genre))

  return (
    <div>
      <h1>recommendations</h1>
      <p>books in your favorite genre <b>{genre}</b></p>
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

    </div>
  )
}

export default Recommended

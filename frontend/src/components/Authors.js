import { useMutation } from '@apollo/client'
import { EDIT_BIRTH } from '../mutations'
import Select from 'react-select'
import { useState } from 'react'

const Authors = (props) => {
  const [editAuthor] = useMutation(EDIT_BIRTH)
  const [selected, setSelected] = useState(null)
  
  const display = props.token === null ? {display: 'none'} : {display: ''}
  if (!props.show) {
    return null
  }
  const authors = props.authors

  const addBirth = (event) => {
    event.preventDefault()
    console.log(selected)
    editAuthor({
      variables: {
        name: selected.value,
        born: Number(event.target.born.value),
      },
    })
    setSelected(null)
    event.target.born.value = ''
  }

  const handleChange = (selectedOption) => {
    setSelected(selectedOption)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born === null ? 'Nan' : a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={display}>
        <h2>Set birthyear</h2>
        <form onSubmit={addBirth}>
          <Select
            options={authors
              .filter((author) => author.born === null)
              .map((author) => {
                return { value: author.name, label: author.name }
              })}
            onChange={handleChange}
          />
          born:
          <input name="born" />
          <button>update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors

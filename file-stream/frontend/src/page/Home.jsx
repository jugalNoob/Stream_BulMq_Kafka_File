import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <div>
    <h1>jugal sharma</h1>

    <NavLink tgo="/">home</NavLink>
    <br />
    <NavLink to="/file">YourStorage</NavLink>
    <br />
    <NavLink to="/create">createFile</NavLink>
    <br />
    <NavLink to="/Read">readFile</NavLink>
    <br />
    <NavLink to="/del">deleteFile</NavLink>
    </div>
  )
}

export default Home

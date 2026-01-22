//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css' 

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welcome to Citizen Science App for Kids</h1>
      <div id='login'>
        <form>
          <label form='username'>Username: </label>
          <input type='text' id='username' name='username'></input><br/>
          <label form='password'>Password: </label>
          <input type='text' id='password' name='password'></input><br/>
          <input type='button' value={'submit'} id='submit' name='submit'></input>
        </form>
      </div>
    </>
  )
}

function ProjectList() {
  return (
    <>
    <h1>Projects</h1>
    <div id='project-list'>
      <table id='project-list-table'>
        <tr>
          <td>Title</td>
          <td>Description</td>
          <td>Code</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
    </>
  )
}

function NewProject() {
  return (
    <>
    <h1>Create a Project</h1>
    <div id='create-project'>
      <button>X</button>
      <form id='create-project-form'>
        <label form='title'>Title: </label>
        <input type='text' id='title' name='title'></input><br/>
        <label form='description'>Description: </label>
        <input type='text' id='description' name='description'></input><br/>
        <label form='instructions'>Instructions: </label>
        <input type='text' id='instructions' name='instructions'></input><br/>
        <label form='observations'>Observations: </label>
        <input type='text' id='observations' name='observations'></input><br/>
        <input type='button' value={'submit'} id='submit' name='submit'></input>
      </form>
    </div>
    </>
  )
}

function ProjectResults() {
  return (
    <>
    <h1>Project Results</h1>
    <button>Back</button>
    <div id='project-results'>
      <table id='project-results-table'>
        <tr>
          <td>Student</td>
          <td>Observation</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
      </table>
      <button>Create Me a Graph</button>
      <button>Download SVG</button>
    </div>
    </>
  )
}

export {App, ProjectList, NewProject, ProjectResults};

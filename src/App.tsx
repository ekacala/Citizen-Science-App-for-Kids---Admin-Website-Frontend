import './App.css' 
import { oauthSignIn } from './components/SignIn'
import { addProject, exitAddProject, logoutAccount } from './components/navigation'
import { dropdownMenu } from './components/menu'

import menuButton from './assets/menu-icon.svg'

function Login() {
  /* Returns the html for the login page */
  return (
    <>
      <div id='home-page'>
        <h1 id='login-title'>Citizen Science App for Kids</h1>
        <div id='login-section'>
          <div id='login-box'>
            <form action={oauthSignIn}>
              <button type='submit' id='login-button'>Login with Google</button>
            </form>
            <p>------------------OR-------------------</p>
            <form action={oauthSignIn}>
              <button type='submit' id='sign-up-button'>Create an Account</button>
            </form>
          </div>
          <div id='welcome-box'>
            <h2>Welcome!</h2>
            <p>This is the administrative website for the app Citizen Science App for Kids, an app where students of all 
              ages can record observations for citizen science projects. This website is where teachers can manage their 
              student's projects and view their observations. Log in with Google or create an account to get started!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function ProjectList() {
  /* Returns the html for the project list page.*/
  return (
    <>
    <div id='menu'>
      <button onClick={dropdownMenu} id='menu-button'><img id='menu-button-img' src={ menuButton }></img></button>
    </div>
    <div id='dropdown-menu' className='hide'>
      <a onClick={logoutAccount}><p>Logout</p></a>
      <p>Delete Account</p>
    </div>
    <h1>Projects</h1>
    <div id='project-list'>
      <table id='project-list-table'>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Code</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          
          <tr>
            <td>Bee Observation</td>
            <td>Record the number of bees spotted in the field next to the school for 1 week.</td>
            <td>7ABD3</td>
            <td><button id='edit-button'>Edit</button></td>
          </tr>
        </tbody>
      </table>
      <button onClick={addProject} id='new-project-button'>Create New</button>
    </div>
    </>
  )
}

function NewProject() {
  /* Returns the html for the new project page. */
  return (
    <>
    <h1>Create a Project</h1>
    <div id='create-project'>
      <button onClick={exitAddProject}>X</button>
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
  /* Returns the html for the project results page. */
  return (
    <>
    <h1>Project Results</h1>
    <button>Back</button>
    <div id='project-results'>
      <table id='project-results-table'>
        <tr>
          <td>Student</td>
          <td>Day of the Week</td>
          <td>Number of Bees</td>
        </tr>
        <tr>
          <td>Jimmy</td>
          <td>Monday</td>
          <td>3</td>
        </tr>
        <tr>
          <td>Kim</td>
          <td>Monday</td>
          <td>2</td>
        </tr>
        <tr>
          <td>Jimmy</td>
          <td>Tuesday</td>
          <td>4</td>
        </tr>
        <tr>
          <td>Kim</td>
          <td>Tuesday</td>
          <td>5</td>
        </tr>
      </table>
      <button>Create Me a Graph</button>
      <button>Download SVG</button>
    </div>
    </>
  )
}

export {Login, ProjectList, NewProject, ProjectResults};

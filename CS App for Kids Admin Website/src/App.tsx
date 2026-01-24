//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css' 

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welcome to Citizen Science App for Kids</h1>
      <form action='https://accounts.google.com/o/oauth2/v2/auth'>
        <button type='submit' id='login-button'>Login with Google</button>
      </form>
    </>
  )
}

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {'client_id': 'YOUR_CLIENT_ID',
                'redirect_uri': 'YOUR_REDIRECT_URI',
                'response_type': 'token',
                'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', p);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
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

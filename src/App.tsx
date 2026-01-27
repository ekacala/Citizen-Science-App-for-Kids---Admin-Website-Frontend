import './App.css' 

function Login() {
  /* Returns the html for the login page */
  return (
    <>
      <h1>Citizen Science App for Kids</h1>
      <div id='home-page'>
        <div id='login-box'>
          <form action='https://accounts.google.com/o/oauth2/v2/auth'>
            <button type='submit' id='login-button'>Login with Google</button>
          </form>
          <p>------------------OR-------------------</p>
          <form action='https://accounts.google.com/o/oauth2/v2/auth'>
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
    </>
  )
}

/*
 * Create form to request access token from Google's OAuth 2.0 server. - Plan to set this up next sprint
 
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  const form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  const params = {'client_id': 'YOUR_CLIENT_ID',
                'redirect_uri': 'YOUR_REDIRECT_URI',
                'response_type': 'token',
                'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

  // Add form parameters as hidden input values.
  for (let p in params) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', p);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}*/

function ProjectList() {
  /* Returns the html for the project list page. */
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
          <td>test</td>
          <td>test</td>
          <td>test</td>
        </tr>
      </table>
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
  /* Returns the html for the project results page. */
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
          <td>test</td>
          <td>test</td>
        </tr>
      </table>
      <button>Create Me a Graph</button>
      <button>Download SVG</button>
    </div>
    </>
  )
}

export {Login, ProjectList, NewProject, ProjectResults};

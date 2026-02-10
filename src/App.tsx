import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import './App.css' 
import { addProject, logoutAccount, projectPage } from './components/navigation'
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
            <form action='https://csafk-277534145495.us-east4.run.app/api/login'>
              <button type='submit' id='login-button' >Login with Google</button>
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

function SuccessRedirect() {
  //Get teacher info
  const [teacher, setTeacher] = useState('');
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    //Need to enable login functionality in order to make teacher id in endpoint dynamic
    fetch("https://csafk-277534145495.us-east4.run.app/api/me", {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const teacherArray = json.data
        setTeacher(teacherArray.teacher_id);
        setLoaded(true)
      })
  }, [loaded]);
  console.log(teacher)
  if(loaded) {
    projectPage(teacher)
  }
  return ( 
    <p>redirecting...</p>
  )
}

function ProjectList() {
  interface project {
    project_id: string;
    project_title: string;
    project_description: string;
    project_code: string;
  }
  const [projects, setProjects] = useState<project[]>([]);
  const [loaded, setLoaded] = useState(false)
  const [emptyProjects, setEmptyProjects] = useState(true)
  
  const teacher_id = window.location.pathname.slice(-1)

  //Get list of projects for teacher
  useEffect(() => {
    fetch(`https://csafk-277534145495.us-east4.run.app/api/users/${teacher_id}/projects`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const projectArray = json.data
        setProjects(projectArray);
        if (projects.length > 0) {
          setEmptyProjects(false)
        }
        setLoaded(true);
      })
  }, [loaded]);
  if (!loaded) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

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
    {emptyProjects ? (
      <p>Welcome! Please create a new project to get started.</p>
    ) : (
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
        <tbody >
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td>{project.project_title}</td>
              <td>{project.project_description}</td>
              <td>{project.project_code}</td>
              <td><button>Edit</button></td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
    )}
    <button onClick={() => addProject(teacher_id)} id='new-project-button'>Create A New Project</button>
    </>
  )
}

function NewProject() {
  const [teacherId, setTeacherId] = useState(window.location.pathname.slice(-1));
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectInstructions, setProjectInstructions] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // 3. Handle form submission
  const createNewProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      teacher_id: teacherId,
      project_title: projectTitle,
      project_description: projectDescription,
      project_instructions: projectInstructions
    }
    console.log(data)

    try {
      // 4. Send a POST request to your API endpoint
      fetch(`https://csafk-277534145495.us-east4.run.app/api/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      console.log('success')
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
    if (submitted) {
      projectPage(teacherId)
    }
    
  }
  /* Returns the html for the new project page. */
  return (
    <>
    <h1>Create a Project</h1>
    <div id='create-project'>
      <button>X</button>
      <form onSubmit={createNewProject} id='create-project-form'>
        <label htmlFor='title'>Title: </label>
        <input type='text' id='title' name='title' onChange={(event) => setProjectTitle(event.target.value)}></input><br/>
        <label htmlFor='description'>Description: </label>
        <textarea id='description' name='description' onChange={(event) => setProjectDescription(event.target.value)}></textarea><br/>
        <label htmlFor='instructions'>Instructions: </label>
        <textarea id='instructions' name='instructions' onChange={(event) => setProjectInstructions(event.target.value)}></textarea><br/>
        <input type='submit' value={'submit'} id='submit' name='submit'></input>
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

export {Login, SuccessRedirect, ProjectList, NewProject, ProjectResults};

import { useState, useEffect, type FormEvent } from 'react'
import { useForm, useWatch, useFieldArray } from 'react-hook-form'
import './App.css' 
import { addProject, logoutAccount, projectDetailsPage, projectPage } from './components/navigation'
import { dropdownMenu } from './components/menu'

import menuButton from './assets/menu-icon.svg'
import googleIcon from './assets/google-logo.svg'

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
            <img id='google-login-image' src={googleIcon}></img>
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
  const [projectId, setProjectId] = useState('')
  
  // Get teacher id from url
  const teacher_id = window.location.pathname.slice(10)

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

  function deleteConfirmation(event: any, project_id: string) {
    event.preventDefault()
    setProjectId(project_id)
    const confirmation = document.getElementById('confirmation-box')
    confirmation!.classList.toggle('show')
}

  const deleteProject = (event: any) => {
    event.preventDefault()
    console.log('click')

    try {
      // Send POST request
      fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then((res) => res.json())
      .then((json) => {
        console.log(json)
        const updatedProjects = projects.filter(project => project.project_id !== projectId)
        setProjects(updatedProjects)
        })  
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
      console.log('error block')
    }
    deleteConfirmation(event, '')
  }

  /* Returns the html for the project list page.*/
  return (
    <>
    <div id='menu'>
      <button onClick={dropdownMenu} id='menu-button'><img id='menu-button-img' src={ menuButton }></img></button>
    </div>
    <div id='dropdown-menu' className='hide'>
      <a className='dropdown-button' onClick={logoutAccount}><p>Logout</p></a>
      <p>Delete Account</p>
    </div>
    <h1 id='project-title'>Projects</h1>
    {emptyProjects ? (
      <p>Welcome! Please create a new project to get started.</p>
    ) : (
    <div id='project-list'>
      <table id='project-list-table'>
        <thead>
          <tr>
            <td id='project-title-table-data'>Title</td>
            <td id='project-description-table-data'>Description</td>
            <td id='project-id-table-data'>Code</td>
            <td id='project-delete-table-data'>Delete a Project</td>
          </tr>
        </thead>
        <tbody >
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td><a onClick={() => projectDetailsPage(teacher_id, project.project_id)} id='project-title-link'>{project.project_title}</a></td>
              <td>{project.project_description}</td>
              <td>{project.project_code}</td>
              <td>
                <form onSubmit={(event) => deleteConfirmation(event, project.project_id)}>
                  <button type='submit' id='delete-project-button'>Delete</button>
                </form>
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
    )}
    <button onClick={() => addProject(teacher_id)} id='new-project-button'>Create A New Project</button>
    <div id='confirmation-box' className='hide'>
      <h2>Are you sure you want to delete this project?</h2>
      <p>All information for this project including student observations will be deleted if you do.</p>
      <button className='confirmation-box-button' onClick={(event) => deleteProject(event)}>Yes</button>
      <button className='confirmation-box-button' onClick={(event) => deleteConfirmation(event, '')}>No</button>
    </div>
    </>
  )
}

function NewProject() {
  // Get teaacher id from url
  const teacherId = window.location.pathname.slice(13)
  // Info collected to create new project
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectInstructions, setProjectInstructions] = useState('')

  // Info collected to add data fields to a project
  const [projectId, setProjectId] = useState('-1')

  // Track progress through form
  const [projectCreated, setProjectCreated] = useState(false)

  // Define FormData types for fields form
  type FormData = {
    field_name: string
    field_type: string
    field_label: string
    field_options: {option: string}[]
    field_required: null
  }

  // Remove any blank values
  const cleanData = (data: any) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    )
  }

  // Convert is_required to boolean
  const parseBoolean = (value: string) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }

  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      field_options: [{option: ''}]
    }
  })

  // Convert field_options from json to plain array
  const convertJson = (data: any) => {
    let fieldOptionsArray = []
    if (data.field_options[0]['option'] == '') {
      delete data['field_options']
      return data
    } else {
    for (let d in data.field_options) {
     fieldOptionsArray.push(data.field_options[d]['option'])
     //console.log(data.field_options[d]['option'])
    }
    data.field_options = fieldOptionsArray
    //data.field_options = ['1']
   // console.log(fieldOptionsArray)
    return data
    }
  }

  // Disable field_options input if field_type is radio or checkbox
  const watchFieldType = useWatch({control, name: 'field_type', defaultValue: 'text'})
  const isOptionsDisabled = watchFieldType?.includes('text') ||
    watchFieldType?.includes('textarea') ||
    watchFieldType?.includes('number') ||
    watchFieldType?.includes('date') ||
    watchFieldType?.includes('time')

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'field_options'
  })

  // Submit form to create new fields for a project
  const onSubmit = async (data: any) => {
    const cleanedData = cleanData(data)
    const convertedData = convertJson(cleanedData)
    console.log(convertedData)
    try {
      // Send POST request
      fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/fields`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(convertedData)
    })
    .then((res) => res.json())
      .then((json) => {
        console.log(json)
        })
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
      console.log('error block')
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  })

  // Submit form to create new project
  const createNewProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Check if form input is empty
    // Will likely need to expand this to check for more incorrect submissions
    if (projectTitle == '' || projectDescription == '' || projectInstructions == '') {
      alert('Please fill out all fields to create a project.')
      return
    }

    // Put data in JSON format
    const data = {
      teacher_id: teacherId,
      project_title: projectTitle,
      project_description: projectDescription,
      project_instructions: projectInstructions
    }
    console.log(data)

    try {
      // Send POST request
      fetch(`https://csafk-277534145495.us-east4.run.app/api/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
      .then((json) => {
        const fieldArray = json.data
        setProjectId(fieldArray.project_id)
        setProjectCreated(true)
        })  
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
      console.log('error block')
    }
    
  }

  /* Returns the html for the new project page. */
  return (
    <>
    <h1>Create a Project</h1>
    {!projectCreated ? (
    <div id='create-project'>
      <button id='exit-create-project-button' onClick={() => projectPage(teacherId)}>X</button>
      <form onSubmit={createNewProject} id='create-project-form'>
        <label htmlFor='title'>Title: </label>
        <input type='text' id='title' name='title' onChange={(event) => setProjectTitle(event.target.value)}></input><br/>
        <label htmlFor='description'>Description: </label>
        <textarea id='description' name='description' onChange={(event) => setProjectDescription(event.target.value)}></textarea><br/>
        <label htmlFor='instructions'>Instructions: </label>
        <textarea id='instructions' name='instructions' onChange={(event) => setProjectInstructions(event.target.value)}></textarea><br/>
        <input type='submit' value={'Create Project'} id='submit' name='submit'></input>
      </form>
    </div>
    ) : (
    <div id='add-data'>
      <form onSubmit={handleSubmit(onSubmit)} id='add-data-form'>
        <label htmlFor='field_name'>Name: </label>
        {/*<input type='text' id='field_name' name='field_name' value={projectFieldName} onChange={(event) => setProjectFieldName(event.target.value)}></input><br/>*/}
        <input type='text' id='field_name' defaultValue={''} {...register('field_name')} ></input><br/>

        <label htmlFor='field_label'>Label: </label>
        <input type='text' id='field_label' defaultValue={''} {...register('field_label')}></input><br/>

        <label htmlFor='field_type'>Type: </label>
        <select id='field_type' defaultValue={'text'} {...register('field_type')}>
          <option value={'text'}>Single Line Text</option>
          <option value={'textarea'}>Multi Line Paragraph</option>
          <option value={'number'}>Number</option>
          <option value={'date'}>Date</option>
          <option value={'time'}>Time</option>
          <option value={'checkbox'}>Checkbox</option>
          <option value={'radio'}>Multiple Choice</option>
        </select><br/>

        <label htmlFor='field_options'>Options: </label>
        <ul id='field-options-list'>
          {fields.map((field, index) => (
            <li key={field.id}>
              <input type='text' id='field_options' defaultValue={''} {...register(`field_options.${index}.option`)} disabled = {isOptionsDisabled}></input>
              <button type='button' className='delete-field-option-button' onClick={() => remove(index)}>Delete</button>
            </li>
          ))}
        </ul>
          {/*<input type='text' id='field_options' defaultValue={''} {...register('field_options')} disabled = {isOptionsDisabled}></input><br/>*/}

        <button id='add-field-option-button' type='button' onClick={() => append({option: ''})}>Add Option</button>

        <label htmlFor='field_required'>Is this data point required? </label>
        <select id='field_required' defaultValue={''} {...register('field_required', { setValueAs: parseBoolean })}>
          <option value={'false'}>No</option>
          <option value={'true'}>Yes</option>
          
        </select><br/>

        <input type='submit' value={'Add Data Point'} id='field-submit' name='field_submit'></input>

        <button id='exit-create-data-button' onClick={() => projectPage(teacherId)}>I'm Done Adding Data Points</button>
      </form>
      
    </div>
    )}
    </>
  )
}


function ProjectResults() {
  // Get teacherId and projectId
  const idNums = window.location.pathname.slice(17)
  const idList = idNums.split('/')
  const teacherId = idList[0]
  const projectId = idList[1]

  const [loaded, setLoaded] = useState(false)

  const [projectTitle, setProjectTitle] = useState('')
  const [projectCode, setProjectCode] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectInstructions, setProjectInstructions] =useState('')

  // Setup data needed to display project fields from array
  interface field {
    field_id: string
    field_name: string
  }
  const [projectFields, setProjectFields] = useState<field[]>([])

  // Setup data needed to display project observations from array
  interface observation {
    observaton_id: string
    student_name: string
    field_data: [{
      data_id: string
      field_name: string
      field_value: string
    }]
  }
  const [projectObservations, setProjectObservations] = useState<observation[]>([])

  // Get details of project
  useEffect(() => {
    // Get project
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const projectArray = json.data
       // console.log(projectArray)
        setProjectTitle(projectArray.project_title)
        setProjectCode(projectArray.project_code)
        setProjectDescription(projectArray.project_description)
        setProjectInstructions(projectArray.project_instructions)
        setLoaded(true)
      })
    // Get fields
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/fields`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const fieldsArray = json.data 
       // console.log(fieldsArray)
        setProjectFields(fieldsArray)
      })
    // Get observations
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/observations`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const observationsArray = json.data 
        setProjectObservations(observationsArray)
      })
  }, [loaded]);
  if (!loaded) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  const createDownloadLink = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename; // Set the desired file name

    // Append anchor to body, click it, and remove it
    document.body.appendChild(a);
    a.click();

    // Clean up the temporary URL and element
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const downloadSVG = (event: any) => {
    event.preventDefault()

    try {
      // Send POST request
      fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/export/csv`, {
      method: 'GET',
      credentials: 'include',
    })
    .then((res) => res.blob())
      .then((blob) => {
        createDownloadLink(blob, 'test') // Need to figure out how to grab filename from response
        })  
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
      console.log('error block')
    }
  }

  /* Returns the html for the project results page. */
  return (
    <>
    <h1>Project Results</h1>
    <button onClick={() => projectPage(teacherId)}>Back</button>
    <div id='project-details'>
      <h2>Project Details</h2>
      <p>Title: {projectTitle}</p>
      <p>Code: {projectCode}</p>
      <p>Description: {projectDescription}</p>
      <p>Instructions: {projectInstructions}</p>
    </div>
    <div id='project-results'>
      <table id='project-results-table'>
        <thead>
          <tr>
            <td>Student</td>
            {projectFields.map((field) => (
            <td key={field.field_id}>{field.field_name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {projectObservations.map((observation) => (
          <tr key={observation.observaton_id}>
            <td>{observation.student_name}</td>
            {observation.field_data.map((obv) => (
              <td key={obv.data_id}>{obv.field_value}</td>
            ))}
          </tr>
          ))}
        </tbody>
      </table>
      <button>Edit Project Details</button>
      <button>Add New Fields</button>
      <button>Create Me a Graph</button>
      <button onClick={downloadSVG}>Download Data</button>
    </div>
    </>
  )
}

export {Login, SuccessRedirect, ProjectList, NewProject, ProjectResults};

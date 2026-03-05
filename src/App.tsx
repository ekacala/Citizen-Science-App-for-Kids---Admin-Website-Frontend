import { useState, useEffect, type FormEvent } from 'react'
import { useForm, useWatch, useFieldArray } from 'react-hook-form'
import { RechartsDevtools } from '@recharts/devtools'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'
import './App.css' 
import { addProject, logoutAccount, projectDetailsPage, projectPage, newFieldsPage, editProjectPage } from './components/navigation'
import { dropdownMenu, graphBox } from './components/menu'

import menuButton from './assets/menu-icon.svg'
import googleIcon from './assets/google-logo.svg'
import editIcon from './assets/edit-icon.svg'
import plusIcon from './assets/plus-icon.svg'
import deleteIcon from './assets/delete-icon.svg'

Chart.register(...registerables)

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
  }, [loaded, projects.length, teacher_id]);
  if (!loaded) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  function deleteConfirmation(event: FormEvent<HTMLFormElement>, project_id: string) {
    event.preventDefault()
    setProjectId(project_id)
    const confirmation = document.getElementById('confirmation-box')
    confirmation!.classList.toggle('show')
}

  const deleteProject = (event: FormEvent<HTMLFormElement>) => {
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
      <div id='confirmation-box-button-box'>
        <form onSubmit={(event) => deleteProject(event)}>
          <button className='confirmation-box-button'>Yes</button>
        </form>
        <form onSubmit={(event) => deleteConfirmation(event, '')}>
          <button className='confirmation-box-button'>No</button>
        </form>
      </div>
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

  // Track progress through form
  const [projectCreated, setProjectCreated] = useState(false)

  // Info collected to add data fields to a project
  const [projectId, setProjectId] = useState('-1')

  // Define FormData types for fields form
  type FormData = {
    field_name: string
    field_type: string
    field_label: string
    field_options?: {option: string}[]
    field_required: null
  }

  // Remove any blank values
  const cleanData = (data: object) => {
    //console.log(data)
    return Object.fromEntries(
      Object.entries(data).filter(([value]) => value !== '')
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
    formState: { isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      field_options: [{option: ''}]
    }
  })

  // Convert field_options from json to plain array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertJson = (data: {[k: string]:any}) => {
    //console.log(data)
    const fieldOptionsArray = []
    if (data.field_options![0]['option'] == '') {
      delete data['field_options']
      return data
    } else {
    for (const d in data.field_options) {
     fieldOptionsArray.push(data.field_options[d]['option'])
     //console.log(data.field_options[d]['option'])
    }
    data.field_options = fieldOptionsArray
    //data.field_options = ['1']
   // console.log(fieldOptionsArray)
    return data
    }
  }

  // Disable field_options input if field_type is radio or multiselect
  const watchFieldType = useWatch({control, name: 'field_type', defaultValue: 'text'})
  const isOptionsDisabled = watchFieldType?.includes('text') ||
    watchFieldType?.includes('textarea') ||
    watchFieldType?.includes('number') ||
    watchFieldType?.includes('date') ||
    watchFieldType?.includes('time') ||
    watchFieldType?.includes('checkbox')

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'field_options'
  })

  // Submit form to create new fields for a project
  const onSubmit = async (data: FormData) => {
    const cleanedData = cleanData(data)
    const convertedData = convertJson(cleanedData)
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
      <form onSubmit={createNewProject} id='create-project-form' className='project-data-form'>
        <label htmlFor='title'>Title: </label>
        <input type='text' id='title' name='title' onChange={(event) => setProjectTitle(event.target.value)}></input><br/>
        <label htmlFor='description'>Description: </label>
        <textarea id='description' name='description' onChange={(event) => setProjectDescription(event.target.value)}></textarea><br/>
        <label htmlFor='instructions'>Instructions: </label>
        <textarea id='instructions' name='instructions' onChange={(event) => setProjectInstructions(event.target.value)}></textarea><br/>
        <input type='submit' value={'Create Project'} id='submit-new-project' name='submit'></input>
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
          <option value={'checkbox'}>True/False</option>
          <option value={'multiselect'}>Multiselect</option>
          <option value={'radio'}>Multiple Choice</option>
        </select><br/>

        <label htmlFor='field_options'>Options: </label>
        <ul id='field-options-list'>
          {fields.map((field, index) => (
            <li key={field.id}>
              <input type='text' id='field_options' defaultValue={''} {...register(`field_options.${index}.option`)} disabled = {isOptionsDisabled}></input>
              <button type='button' className='delete-field-option-button' onClick={() => remove(index)}><img src={deleteIcon}></img></button>
            </li>
          ))}
        </ul>
          {/*<input type='text' id='field_options' defaultValue={''} {...register('field_options')} disabled = {isOptionsDisabled}></input><br/>*/}

        <button id='add-field-option-button' type='button' onClick={() => append({option: ''})}><img src={plusIcon}></img></button>

        <label htmlFor='field_required'>Is this data point required? </label>
        <select id='field_required' defaultValue={''} {...register('field_required', { setValueAs: parseBoolean })}>
          <option value={'false'}>No</option>
          <option value={'true'}>Yes</option>
          
        </select><br/>
        <div id='field-form-buttons'>
          <input type='submit' value={'Create'} id='field-submit'  name='field_submit'></input>
          <button id='exit-create-data-button' onClick={() => projectPage(teacherId)}>Finish</button>
        </div>
      </form>
      
    </div>
    )}
    </>
  )
}

function NewFields() {
  // Get teacherId and projectId
  const idNums = window.location.pathname.slice(12)
  const idList = idNums.split('/')
  const teacherId = idList[0]
  const projectId = idList[1]

  // Define FormData types for fields form
  type FormData = {
    field_name: string
    field_type: string
    field_label: string
    field_options?: {option: string}[]
    field_required: null
  }

  // Remove any blank values
  const cleanData = (data: object) => {
    //console.log(data)
    return Object.fromEntries(
      Object.entries(data).filter(([value]) => value !== '')
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
    formState: { isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      field_options: [{option: ''}]
    }
  })

  // Convert field_options from json to plain array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertJson = (data: {[k: string]:any}) => {
    //console.log(data)
    const fieldOptionsArray = []
    if (data.field_options![0]['option'] == '') {
      delete data['field_options']
      return data
    } else {
    for (const d in data.field_options) {
     fieldOptionsArray.push(data.field_options[d]['option'])
    }
    data.field_options = fieldOptionsArray
    return data
    }
  }

  // Disable field_options input if field_type is radio or multiselect
  const watchFieldType = useWatch({control, name: 'field_type', defaultValue: 'text'})
  const isOptionsDisabled = watchFieldType?.includes('text') ||
    watchFieldType?.includes('textarea') ||
    watchFieldType?.includes('number') ||
    watchFieldType?.includes('date') ||
    watchFieldType?.includes('time') ||
    watchFieldType?.includes('checkbox')

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'field_options'
  })

  // Submit form to create new fields for a project
  const onSubmit = async (data: FormData) => {
    const cleanedData = cleanData(data)
    const convertedData = convertJson(cleanedData)
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
  return (
  <>
    <h1>Create New Fields</h1>
    <div id='add-data'>
      <form onSubmit={handleSubmit(onSubmit)} id='add-data-form'>
        <label htmlFor='field_name'>Name: </label>
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
          <option value={'checkbox'}>True/False</option>
          <option value={'multiselect'}>Multiselect</option>
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

        <button id='add-field-option-button' type='button' onClick={() => append({option: ''})}>Add Option</button>

        <label htmlFor='field_required'>Is this data point required? </label>
        <select id='field_required' defaultValue={''} {...register('field_required', { setValueAs: parseBoolean })}>
          <option value={'false'}>No</option>
          <option value={'true'}>Yes</option>
          
        </select><br/>

        <input type='submit' value={'Add Data Point'} id='field-submit' name='field_submit'></input>

        <button id='exit-create-data-button' onClick={() => projectDetailsPage(teacherId, projectId)}>I'm Done Adding Data Points</button>
      </form>
      
    </div>
    </>
  )
}

function EditProject() {
  // Get teacherId and projectId
  const idNums = window.location.pathname.slice(14)
  const idList = idNums.split('/')
  const teacherId = idList[0]
  const projectId = idList[1]


  // Store project details
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectInstructions, setProjectInstructions] =useState('')

  const [loaded, setLoaded] = useState(false)

  // Define FormData types for fields form
  type FormData = {
    project_title: string
    project_description: string
    project_instructions: string
  }

  // Get project and set project values
  useEffect(() => {
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const projectArray = json.data
        console.log(projectArray)
        setProjectTitle(projectArray.project_title)
        setProjectDescription(projectArray.project_description)
        setProjectInstructions(projectArray.project_instructions)
        setLoaded(true)
      })
  }, [loaded, projectId]);

  // Remove any blank values
  const cleanData = (data: object) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    )
  }

  const {
    register,
    handleSubmit,
  } = useForm<FormData>({
  })

  // Submit form to edit details for a project
  const onSubmit = async (data: FormData) => {
    const cleanedData = cleanData(data)
    // Check if no values have been changed
    if (Object.keys(cleanedData).length == 0) {
      alert('Please edit at least one value')
      return
    }
    console.log(cleanedData)
    try {
      // Send POST request
      fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanedData)
      
    })
    .then(() => (
      projectDetailsPage(teacherId, projectId)
    ))
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
      console.log('error block')
    }
  }

  return (
    <>
    <h1>Edit {projectTitle}</h1>
    <div id='add-data'>
      <form onSubmit={handleSubmit(onSubmit)} id='edit-data-form' className='project-data-form'>
        <label htmlFor='project_title'>Title: </label>
        <input type='text' id='project_title' defaultValue={projectTitle} {...register('project_title')} ></input><br/>

        <label htmlFor='project_description'>Description: </label>
        <textarea id='project_description' defaultValue={projectDescription} {...register('project_description')}></textarea><br/>

        <label htmlFor='project_instructions'>Instructions: </label>
        <textarea id='project_instructions' defaultValue={projectInstructions} {...register('project_instructions')}></textarea><br/>

        <div>
          <input type='submit' value={'Edit Project'} id='edit-project-submit' className='button' name='field_submit'></input>
          
        </div>
      </form>
      <button id='cancel-edit-project-button' className='button' onClick={() => projectDetailsPage(teacherId, projectId)}>Cancel</button>
    </div>
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

  // Setup data needed to generate a graph
  interface graph {
    chart_type: string
    field_id: number
    field_label: string
    field_name: string
    field_type: string
    stats: {
      timeline: [{
        count: number
        date: number
      }]
      count?: number
      max?: number
      mean?: number
      min?: number
      frequency: [{
        count: number
        value: string
      }]
    }
  }

  const [graphFields, setGraphFields] = useState<graph[]>([])
  const [showNumericCard, setShowNumericCard] = useState(false)

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
        setProjectTitle(projectArray.project_title)
        setProjectCode(projectArray.project_code)
        setProjectDescription(projectArray.project_description)
        setProjectInstructions(projectArray.project_instructions)
      })
    // Get fields
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/fields`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const fieldsArray = json.data 
        setProjectFields(fieldsArray)
      })
    // Get observations
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/observations?format=string`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const observationsArray = json.data
        setProjectObservations(observationsArray)
      })
    // Get graph info
    fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/stats`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {
        const data = json.data 
        setGraphFields(data.fields)
        setLoaded(true)
      })
  }, [loaded, projectId]);
  if (!loaded) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  // Create CSV download for user
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

  // Helper function to get CSV file from backen
  const downloadCSV = async () => {
    const response = await fetch(`https://csafk-277534145495.us-east4.run.app/api/projects/${projectId}/export/csv`, {
      method: 'GET',
      credentials: 'include',
    })
    // Get filename from header
    const header = response.headers.get('Content-Disposition')
    const splitHeader = header!.split('filename=')
    const title = splitHeader[1]

    // get blob data
    const blobData = await response.blob()

    createDownloadLink(blobData, title)
  }

  // Create color palette for pie charts
  const palette = [
    '#39d353','#58a6ff','#ffa657','#f78166','#bc8cff',
    '#39c5cf','#e3b341','#db61a2','#79c0ff','#56d364'
  ];

  // Generate line graph
  const buildLineGraph = (lineGraphLabels: any, lineGraphData: any, lineGraphId: string) => {
    let myChart!: Chart | null
    if (myChart != null) {
      myChart.destroy()
    }
    const ctx = document.getElementById(lineGraphId) as HTMLCanvasElement

    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lineGraphLabels, datasets: [{
          label: 'Observations', data: lineGraphData, borderWidth: 1, borderColor: '#ffa657', backgroundColor: '#ffa65722',
        pointBackgroundColor: '#ffa657', pointRadius: 5, pointHoverRadius: 7,
        fill: true, tension: 0.35
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {display: false},
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} observations` } }
        },
        scales: {
          x: { grid: { color: '#30363d55' }, ticks: { font: { size: 10 } } },
          y: {beginAtZero: true, grid: { color: '#30363d55' }, ticks: { stepSize: 1, font: { size: 10 } } }
        }
      }
    } as ChartConfiguration);
  }

  // Generate pie graph
  const buildPieGraph = (pieGraphLabels: any, pieGraphData: any, pieGraphId: string) => {
    const ctx = document.getElementById(pieGraphId) as HTMLCanvasElement
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: pieGraphLabels, datasets: [{
          label: 'Observations', data: pieGraphData, borderWidth: 1,
          backgroundColor: palette.slice(0, pieGraphData.length).map(c => c + 'cc'),
          borderColor: palette.slice(0, pieGraphData.length), hoverOffset: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } }
        }
      }
    } as ChartConfiguration);
  }
  
  // Process data to build charts
  const buildCharts = () => {
    graphBox()
    console.log(graphFields)
    let graphData = []
    let graphLabels = []
    
    for (const f in graphFields) {
      if (graphFields[f].chart_type == 'line') {
        for (const t in graphFields[f].stats.timeline) {
          graphLabels.push(graphFields[f].stats.timeline[t].date)
          graphData.push(graphFields[f].stats.timeline[t].count)
        }
        buildLineGraph(graphLabels, graphData, graphFields[f].field_id.toString())
        graphData = []
        graphLabels = []
        
      } else if (graphFields[f].chart_type == 'number') {
        setShowNumericCard(true)
      } else if (graphFields[f].chart_type == 'pie') {
        for (const t in graphFields[f].stats.frequency) {
          graphLabels.push(graphFields[f].stats.frequency[t].value)
          graphData.push(graphFields[f].stats.frequency[t].count)
        }
        buildPieGraph(graphLabels, graphData, graphFields[f].field_id.toString())
        graphData = []
        graphLabels = []
      } 
    }
  }

  /* Returns the html for the project results page. */
  return (
    <>
    <h1 id='project-details-title'>{projectTitle}</h1>
    <button id='project-details-back-button' onClick={() => projectPage(teacherId)}>Back</button>
    <div id='project-details'>
      <button id='project-details-title-button' onClick={() => editProjectPage(teacherId, projectId)}><h2>Project Details</h2><img id='project-edit-icon' src={editIcon}></img></button>
      <p>Access Code: {projectCode}</p>
      <p>Description: {projectDescription}</p>
      <p>Instructions: {projectInstructions}</p>
    </div>
    <div id='project-results'>
      <h2>Student Observations</h2>
      <table id='project-results-table'>
        <thead>
          <tr>
            {/*<td>Student</td>*/}
            {projectFields.map((field) => (
            <td key={field.field_id}>{field.field_name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
           {projectObservations.map((observation) => (
          <tr key={observation.observaton_id}>
            {/*<td>{observation.student_name}</td>*/}
           {observation.field_data.map((obv) => (
              <td key={obv.data_id}>{obv.field_value}</td>
            ))}
          </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => newFieldsPage(teacherId, projectId)}>Add New Fields</button>
      <button onClick={buildCharts}>Create Some Graphs</button>
      <button onClick={downloadCSV}>Download Data</button>
    </div>
    <div id='graph-box' className='hide'>
      <h2 id='graph-box-title'>Graphs</h2>
      <button id='graph-box-exit-button' onClick={buildCharts}>X</button>
      {graphFields.map((graph) => (
        graph.chart_type == 'line' ? (
          <div key={graph.field_id} className='line-graph-box'>
            <h3>{graph.field_name}</h3>
            <p>Field Type: {graph.field_type}</p>
            <div className='graph-cell'>
              <canvas id={graph.field_id.toString()}></canvas>
            </div>
          </div>
        ) : graph.chart_type == 'number' && showNumericCard ? (
          <div key={graph.field_id} className='number-graph-box'>
            <h3>{graph.field_name}</h3>
            <p>Field Type: {graph.field_type}</p>
            <div className="num-cell span2">
              <p className="num-cell-lbl">Average: {graph.stats.mean}</p>
            </div>
            <div className="num-cell">
              <p className="num-cell-lbl">Min: {graph.stats.min}</p>
            </div>
            <div className="num-cell">
              <p className="num-cell-lbl">Max: {graph.stats.max}</p>
            </div>
          </div>
        ) : graph.chart_type == 'pie' ? (
          <div key={graph.field_id} className='pie-graph-box'>
            <h3>{graph.field_name}</h3>
            <p>Field Type: {graph.field_type}</p>
            <div className='graph-cell'>
              <canvas id={graph.field_id.toString()}></canvas>
            </div>
          </div>
        ) : (
          <div key={graph.field_id}></div>
        )))}
      </div>
    </>
  )
}

export {Login, SuccessRedirect, ProjectList, NewProject, ProjectResults, NewFields, EditProject};

import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import {Login, ProjectList, NewProject, ProjectResults} from './App.tsx' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Login />} />

      <Route path='projects' element={<ProjectList />} />

      <Route path='new-project' element={<NewProject />} />

      <Route path='project-results' element={<ProjectResults />} />
    </Routes>
  </BrowserRouter>
)

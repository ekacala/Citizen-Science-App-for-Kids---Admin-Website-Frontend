import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import {Login, SuccessRedirect, ProjectList, NewProject, ProjectResults} from './App.tsx' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Login />} />

      <Route path='auth/success' element={<SuccessRedirect />} />

      <Route path='projects/:teacher-id' element={<ProjectList />} />

      <Route path='new-project/:teacher-id' element={<NewProject />} />

      <Route path='project-results' element={<ProjectResults />} />
    </Routes>
  </BrowserRouter>
)

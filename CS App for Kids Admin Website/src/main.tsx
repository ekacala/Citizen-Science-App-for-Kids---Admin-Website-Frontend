import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import {App, ProjectList, NewProject, ProjectResults} from './App.tsx' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />

      <Route path='projects' element={<ProjectList />} />

      <Route path='new-project' element={<NewProject />} />

      <Route path='project-results' element={<ProjectResults />} />
    </Routes>
  </BrowserRouter>
)

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import {Provider} from 'react-redux'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Course from './components/Courses'
import Assignment from './components/Assignment'
import Workshop from './components/Workshop'
import Quiz from './components/Quiz'
import { store } from './state/store'
import ProfileChecker from './components/ProfileChecker'
import CourseDetail from './components/CourseDetail'
import StudentViewVideo from './components/Student/StudentViewVideo'
import TeacherUploadVideo from './components/Teacher/TeacherUploadVideo'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Register />} />
      <Route path='user/'>
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<ProfileChecker/>} />
        <Route path="login" element={<Login />} />
        <Route path="taccess" element={<TeacherUploadVideo />} />
        <Route path="access/:courseID" element={<StudentViewVideo />} />
      </Route>
      <Route path='course/'>
        <Route path="courses" element={<Course />} />
        <Route path=":courseID" element={<CourseDetail />} />
      </Route>
      <Route path='workshop/'>
        <Route path="workshop" element={<Workshop />} />
      </Route>
      <Route path='assignment/'>
        <Route path="assignment" element={<Assignment />} />
      </Route>
      <Route path='quiz/'>
        <Route path="quiz" element={<Quiz />} />
      </Route>

    </Route>
  )
);

function App() {


  return (
    <Provider store={store}>
          <RouterProvider router={router}/>
    </Provider>
  )
}

export default App

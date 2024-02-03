import Home from './pages/Home'
import StoryQuests from './pages/StoryQuests'
import './main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoadQuest from './pages/LoadQuest'
import NoPage from './pages/NoPage'
import DailyQuests from './pages/DailyQuests'
import Login from './components/UI/Login'
import Signup from './components/UI/Sigup'
import UserContextProvider from './context/UserContext'

function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/dailyquests' element={<DailyQuests/>}/>
            <Route path='/dailyquests/:quest' element={<LoadQuest questType={'daily'}/>}/>
            <Route path='/quests/:quest' element={<LoadQuest questType={'story'}/>}/>
            <Route path='/quests' element={<StoryQuests/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/*' element={<NoPage/>}/>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </>
  )
}

export default App;

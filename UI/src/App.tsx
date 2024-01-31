import Home from './pages/Home'
import Quests from './pages/Quests'
import './main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoadQuest from './pages/LoadQuest'
import NoPage from './pages/NoPage'
import DailyQuest from './pages/DailyMission'
import Login from './components/UI/Login'
import Signup from './components/UI/Sigup'
import { UserContext } from './context/UserContext'
import { User, Stats, Missions, Info } from './types/Index'

function App() {
  const Info: Info = {
    id: -1,
    username: "Guest",
  }

  const Stats: Stats = {
    level: 1,
    title: "",
    streak: 0,
    gems: 0,
    lives: 0
  }

  const Missions: Missions = {
    dailyMissions: [],
    storyMissions: [],
    quests: [],
    achievements: []
  }

  const User: User = {
    info: Info,
    stats: Stats,
    missions: Missions
  }

  

  return (
    <>
      <UserContext.Provider value={User}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/dailyquests' element={<DailyQuest/>}/>
            <Route path='/dailyquests/:quest' element={<LoadQuest questType={'daily'}/>}/>
            <Route path='/quests/:quest' element={<LoadQuest questType={'story'}/>}/>
            <Route path='/quests' element={<Quests/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/*' element={<NoPage/>}/>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

export default App;

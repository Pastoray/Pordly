import Home from './pages/Home'
import StoryQuests from './pages/StoryQuests'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoadQuest from './pages/LoadQuest'
import NoPage from './pages/NoPage'
import DailyQuests from './pages/DailyQuests'
import Login from './components/UI/Login'
import Signup from './components/UI/Sigup'
import UserContextProvider from './context/UserContext'
import DailyQuestsContextProvider from './context/DailyQuestsContext'
import LeaderBoards from './pages/LeaderBoards'
import StoryQuestsContextProvider from './context/StoryQuestsContext'
import './main.scss'
import Achievements from './pages/Achievements'

function App() {
  return (
    <>
      <UserContextProvider>
        <DailyQuestsContextProvider>
          <StoryQuestsContextProvider>
            <BrowserRouter>
              <Routes>
                <Route index element={<Home/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/leaderboards' element={<LeaderBoards/>}/>
                <Route path='/daily-quests' element={<DailyQuests/>}/>
                <Route path='/story-quests' element={<StoryQuests/>}/>
                <Route path='/:quest_type/:quest_id' element={<LoadQuest/>}/>
                <Route path='/achievements' element={<Achievements/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/*' element={<NoPage/>}/>
              </Routes>
            </BrowserRouter>
          </StoryQuestsContextProvider>
        </DailyQuestsContextProvider>
      </UserContextProvider>
    </>
  )
}

export default App;

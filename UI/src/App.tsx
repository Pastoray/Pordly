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
import DailyQuestsContextProvider from './context/DailyQuestsContext'

function App() {
  return (
    <>
      <UserContextProvider>
        <DailyQuestsContextProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/daily-quests' element={<DailyQuests/>}/>
              <Route path='/quests' element={<StoryQuests/>}/>
              <Route path='/:quest_type/:quest_id' element={<LoadQuest/>}/>
              <Route path='/sign-up' element={<Signup/>}/>
              <Route path='/log-in' element={<Login/>}/>
              <Route path='/*' element={<NoPage/>}/>
            </Routes>
          </BrowserRouter>
        </DailyQuestsContextProvider>
      </UserContextProvider>
    </>
  )
}

export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeWrapper from './pages/HomeWrapper'
import DailyQuestsWrapper from './pages/DailyQuestsWrapper'
import StoryQuestsWrapper from './pages/StoryQuestsWrapper'
import LoadQuestWrapper from './pages/LoadQuestWrapper'
import LeaderboardsWrapper from './pages/LeaderboardsWrapper'
import AchievementsWrapper from './pages/AchievementsWrapper'
import ShopWrapper from './pages/ShopWrapper'
import Login from './components/UI/Login'
import Signup from './components/UI/Sigup'
import NoPage from './pages/NoPage'
import './main.scss'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeWrapper/>}/>
          <Route path='/home' element={<HomeWrapper/>}/>
          <Route path='/daily-quests' element={<DailyQuestsWrapper/>}/>
          <Route path='/story-quests' element={<StoryQuestsWrapper/>}/>
          <Route path='/:quest_type/:quest_id' element={<LoadQuestWrapper/>}/>
          <Route path='/leaderboards' element={<LeaderboardsWrapper/>}/>
          <Route path='/achievements' element={<AchievementsWrapper/>}/>
          <Route path='/shop' element={<ShopWrapper/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/*' element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

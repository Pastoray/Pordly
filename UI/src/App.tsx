import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeWrapper from './views/wrappers/HomeWrapper'
import DailyQuestsWrapper from './views/wrappers/DailyQuestsWrapper'
import StoryQuestsWrapper from './views/wrappers/StoryQuestsWrapper'
import LoadQuestWrapper from './views/wrappers/LoadQuestWrapper'
import LeaderboardsWrapper from './views/wrappers/LeaderboardsWrapper'
import AchievementsWrapper from './views/wrappers/AchievementsWrapper'
import ShopWrapper from './views/wrappers/ShopWrapper'
import ProfileWrapper from './views/wrappers/ProfileWrapper'
import DuelWrapper from './views/wrappers/DuelWrapper'
import UserProfileWrapper from './views/wrappers/UserProfileWrapper'
import Login from './views/pages/Login'
import Signup from './views/pages/Signup'
import NoPage from './views/pages/NoPage'
import './main.scss'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomeWrapper/>}/>
          <Route path='/home' element={<HomeWrapper/>}/>
          <Route path='/duel' element={<DuelWrapper/>}/>
          <Route path='/daily-quests' element={<DailyQuestsWrapper/>}/>
          <Route path='/story-quests' element={<StoryQuestsWrapper/>}/>
          <Route path='/:quest_type/:quest_id' element={<LoadQuestWrapper/>}/>
          <Route path='/leaderboards' element={<LeaderboardsWrapper/>}/>
          <Route path='/achievements' element={<AchievementsWrapper/>}/>
          <Route path='/profile' element={<ProfileWrapper/>}/>
          <Route path='/profile/:user_id' element={<UserProfileWrapper/>}/>
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

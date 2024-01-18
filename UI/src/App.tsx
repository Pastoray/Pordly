import Home from './pages/Home'
import Levels from './pages/Levels'
import DailyMission from './pages/DailyMission'
import './main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LevelChamber from './pages/LevelChamber'
import LoadGame from './pages/LoadGame'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/play' element={<LoadGame paragraphs={60} sentences={60} random={false} timer={true} time={3594}/>}/>
          <Route path='/levels' element={<Levels/>}/>
          <Route path='/levels/:level' element={<LevelChamber/>}/>
          <Route path='/DailyMissions' element = {<DailyMission/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

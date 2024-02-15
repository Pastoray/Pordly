import Welcome from '../components/UI/Welcome'
import Toolbar from '../components/UI/Toolbar'
import Sidebar from '../components/UI/Sidebar'
import Calendar from '../components/UI/Calendar'
import StoryQuestsComponent from '../components/UI/StoryQuestsComponent'
import AchievementsComponent from '../components/UI/AchievementsComponent'
import '../styles/pages/Home.scss'

function Home() {
    return(
        <>
            <Toolbar/>
            <div className='main-window'>
                <div className='main-left-window'>
                    <Sidebar/>
                </div>
                <div className='main-mid-window'>
                    <Welcome/>
                </div>
                <div className='main-right-window'>
                    <Calendar/>
                    <StoryQuestsComponent/>
                    <AchievementsComponent/>
                </div>
            </div>
        </>
    );
}

export default Home;
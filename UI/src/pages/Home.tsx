import Welcome from '../components/UI/Welcome'
import Toolbar from '../components/UI/Toolbar'
import Sidebar from '../components/UI/Sidebar'
import Calender from '../components/UI/Caldender'
import Quests from '../components/UI/Quests'
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
                    <Calender/>
                    <Quests/>
                    <p>cock</p>
                </div>
            </div>
        </>
    );
}

export default Home;
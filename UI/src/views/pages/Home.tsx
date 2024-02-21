import { useEffect, useState } from 'react'
import Welcome from '../../components/UI/Welcome'
import Toolbar from '../../components/UI/Toolbar'
import Sidebar from '../../components/UI/Sidebar'
import Calendar from '../../components/UI/Calendar'
import StoryQuestsComponent from '../../components/UI/StoryQuestsComponent'
import AchievementsComponent from '../../components/UI/AchievementsComponent'
import { get_user } from '../../utils/Index'
import '../../styles/pages/Home.scss'

function Home() {
    const [userValidated, setUserValidated] = useState(false);

    useEffect(() => {
        async function user_exists() {
            const result = await get_user()
            if (result === undefined) {
                window.location.href = '/login'
            } else {
                setUserValidated(true)
            }
        }
        user_exists()
    })
    return(
        <>
            {
            userValidated ?
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
            :
                null
            }
        </>
    );
}

export default Home;
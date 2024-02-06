import Toolbar from '../components/UI/Toolbar';
import Layout from '../components/UI/Layout';
import '../styles/pages/Quests.scss'

function StoryQuests() {
    return(
        <div className='levels-container'>
            <div>
                <Toolbar/>
            </div>
            <div className='layout'>
                <Layout/>
            </div>
        </div>
    );
}

export default StoryQuests;
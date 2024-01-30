import Toolbar from '../components/UI/Toolbar';
import Layout from '../components/UI/Layout';
import '../styles/pages/Quests.scss'

function Quests() {
    return(
        <div className='levels-container'>
            <div>
                <Toolbar/>
            </div>
            <div className='difficulties'>
                <div className='levels-difficulties'>
                </div>
            </div>
            <div className='layout'>
                <Layout/>
            </div>
        </div>
    );
}

export default Quests;
import Toolbar from '../components/UI/Toolbar';
import Layout from '../components/UI/Layout';
import '../styles/pages/Levels.scss'

function Levels() {
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

export default Levels;
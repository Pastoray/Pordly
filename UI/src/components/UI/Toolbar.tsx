import { useContext } from 'react';
import '../../styles/components/Toolbar.scss'
import { UserContext } from '../../context/UserContext';

function Toolbar() {
    const User = useContext(UserContext)
    return(
        <div className='toolbar-container'>
            <div className='toolbar-left-side'>
                <p id='toolbar-level' style={{color: `${User?.stats.level.color}`, textShadow: `0px 0px 3px ${User?.stats.level.color}`}}>({User?.stats.level.level})</p>
                <div className='toolbar-user'>
                    <p style={{color: `${User?.stats.level.color}`, textShadow: `0px 0px 3px ${User?.stats.level.color}`}}>{User?.info.username}</p>
                    <p style={{color: `${User?.stats.level.color}`, textShadow: `0px 0px 3px ${User?.stats.level.color}`, fontSize: "0.75rem" }}>{User?.stats.title.title}</p>
                </div>
            </div>
            <div className='toolbar-right-side'>
                <div>
                    <p id='toolbar-streak'>{User?.stats.streak}🔥</p>
                </div>
                <div>
                    <p id='toolbar-gems'>{User?.stats.gems}💎</p>
                </div>
                <div>
                    <p id='toolbar-lives'>{User?.stats.lives}❤️</p>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;
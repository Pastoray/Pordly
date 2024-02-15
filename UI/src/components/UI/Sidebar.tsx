import '../../styles/components/Sidebar.scss'

function Sidebar() {
    return( 
        <div className='sidebar-container'>
            <div className='sidebar-content'>
                <button onClick={() => window.location.href = '/1vs1'}>1VS1</button>
                <button onClick={() => window.location.href = '/daily-quests'}>Daily Quests</button>
                <button onClick={() => window.location.href = '/story-quests'}>Story Quests</button>
                <button onClick={() => window.location.href = '/achievements'}>Achievements</button>
                <button onClick={() => window.location.href = '/leaderboards'}>Leaderboards</button>
                <button onClick={() => window.location.href = '/shop'}>Shop</button>
                <button onClick={() => window.location.href = '/profile'}>Profile</button>
            </div>
        </div>
    );
}

export default Sidebar;
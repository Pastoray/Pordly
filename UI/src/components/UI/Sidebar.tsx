import '../../styles/components/Sidebar.scss'

function Sidebar() {
    return( 
        <div className='sidebar-container'>
            <div className='sidebar-content'>
                <button onClick={() => window.location.href = '/1vs1'}>Play 1VS1</button>
                <button onClick={() => window.location.href = '/practice'}>Practice</button>
                <button onClick={() => window.location.href = '/dailyquests'}>Daily Quests</button>
                <button onClick={() => window.location.href = '/quests'}>Quests</button>
                <button onClick={() => window.location.href = '/leaderboards'}>Leaderboards</button>
                <button onClick={() => window.location.href = '/achivements'}>Achivements</button>
                <button onClick={() => window.location.href = '/tournements'}>Tournements</button>
                <button onClick={() => window.location.href = '/shop'}>Shop</button>
                <button onClick={() => window.location.href = '/profile'}>Profile</button>
            </div>
        </div>
    );
}

export default Sidebar;
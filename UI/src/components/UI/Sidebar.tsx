import '../../styles/components/Sidebar.scss'

function Sidebar() {
    return( 
        <div className='sidebar-container'>
            <div className='sidebar-content'>
                <button>Play 1VS1</button>
                <button>Practice</button>
                <button onClick={() => window.location.href = '/dailyMissions'}>Daily Missions</button>
                <button>Levels</button>
                <button>Leaderboards</button>
                <button>Achivements</button>
                <button>Tournements</button>
                <button>Shop</button>
                <button>Profile</button>
            </div>
        </div>
    );
}

export default Sidebar;
import Card from './Card';
import '../../styles/components/Welcome.scss'
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function Welcome() {
    const User = useContext(UserContext);
    return(
        <>
            <div className='welcome-page-main'>
                
                <header>
                    <p id='welcome-page-title'>Welcome to Pordly</p>
                </header>
                <main className='welcome-page-main-content'>
                    <section id='welcome-page-section-1'>
                        <p id='welcome-page-title'>Menu</p>
                        <ul>
                            <p>🏆 Leaderboards</p>
                            <p>🏹 1vs1</p>
                            <p>📜 Quests</p>
                            <p>🥇 Tournements</p>
                            <p>🎉 And more...</p>
                        </ul>
                    </section>

                    <section id='welcome-page-section-2'>
                        <div className='welcome-page-credentials'>
                            <p id='welcome-page-title'>Credentials</p>
                            <p>👤 <strong>Username : </strong>{User?.info.username}</p>
                            <p>🏆 <strong>Title : </strong>{User?.stats.title.title}</p>
                            <p>🔥 <strong>Streak : </strong>{User?.stats.streak}</p>
                            <p>💎 <strong>Gems : </strong>{User?.stats.gems}</p>
                            <p>❤️ <strong>Lives : </strong>{User?.stats.lives}</p>
                        </div>
                    </section>
                    <section id='welcome-page-section-3'>
                        <p id='welcome-page-title'>Challenges</p>
                        <div className='welcome-page-cards-container'>
                            <Card title={'Daily Missions'} doneCount={0} totalCount={3}/>
                            <Card title={'Quests'} doneCount={0} totalCount={50}/>
                            <Card title={'Achivements'} doneCount={0} totalCount={15}/>
                        </div>
                    </section>
                </main>
            </div>    
        </>
    );
}

export default Welcome;
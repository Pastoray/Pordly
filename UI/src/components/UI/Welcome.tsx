import Card from './Card';
import '../../styles/components/Welcome.scss'

function Welcome() {
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
                            <p>🎓 Practice Levels</p>
                            <p>🥇 Tournements</p>
                            <p>🎉 And more...</p>
                        </ul>
                    </section>

                    <section id='welcome-page-section-2'>
                        <div className='welcome-page-credentials'>
                            <p id='welcome-page-title'>Credentials</p>
                            <p>👤 <strong>Username:</strong> [Your Username]</p>
                            <p>🏆 <strong>Title:</strong> [Your Title]</p>
                            <p>🔥 <strong>Streak:</strong> [Your Current Streak]</p>
                            <p>💰 <strong>Coins:</strong> [Your Coin Balance]</p>
                            <p>❤️ <strong>Lives:</strong> [Your Remaining Lives]</p>
                        </div>
                    </section>
                    <section id='welcome-page-section-3'>
                        <p id='welcome-page-title'>Challenges</p>
                        <div className='welcome-page-cards-container'>
                            <Card title={'Daily Missions'} doneCount={7} totalCount={7}/>
                            <Card title={'Quests'} doneCount={12} totalCount={49}/>
                            <Card title={'Achivements'} doneCount={55} totalCount={254}/>
                        </div>
                    </section>
                </main>
            </div>    
        </>
    );
}

export default Welcome;
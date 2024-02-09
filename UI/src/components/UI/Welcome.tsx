import Card from './Card';
import '../../styles/components/Welcome.scss'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { DailyQuestsContext } from '../../context/DailyQuestsContext';
import { DailyQuests, StoryQuests, User } from '../../types/Index';
import { StoryQuestsContext } from '../../context/StoryQuestsContext';

function Welcome() {
    const user = useContext<User | undefined>(UserContext);
    const daily_quests = useContext<DailyQuests | undefined>(DailyQuestsContext);
    const story_quests = useContext<StoryQuests | undefined>(StoryQuestsContext);
    const [dailyQuestsFinished, setDailyQuestsFinished] = useState(0)
    const [storyQuestsFinished, setStoryQuestsFinished] = useState(0)

    useEffect(() => {
        if (daily_quests) {
            let count = 0
            for (const quest of daily_quests) {
                if (quest.isComplete) {
                    count += 1
                }
            }
            setDailyQuestsFinished(count);
        }
        if (story_quests) {
            let count = 0
            for (const quest of story_quests) {
                if (quest.isComplete) {
                    count += 1
                }
            }
            setStoryQuestsFinished(count);
        }
    }, [daily_quests, story_quests])

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
                            <p>👤 User → {user?.info.username}</p>
                            <p>🏆 Title → {user?.stats.title.title}</p>
                            <p>🔥 Streak → {user?.stats.streak}</p>
                            <p>💎 Gems → {user?.stats.gems}</p>
                            <p>❤️ Lives → {user?.stats.lives}</p>
                        </div>
                    </section>
                    <section id='welcome-page-section-3'>
                        <p id='welcome-page-title'>Challenges</p>
                        <div className='welcome-page-cards-container'>
                            <Card title={'Daily Quests'} doneCount={dailyQuestsFinished} totalCount={3}/>
                            <Card title={'Story Quests'} doneCount={storyQuestsFinished} totalCount={20}/>
                            <Card title={'Achivements'} doneCount={0} totalCount={15}/>
                        </div>
                    </section>
                </main>
            </div>    
        </>
    );
}

export default Welcome;
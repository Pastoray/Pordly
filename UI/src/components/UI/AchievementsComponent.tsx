import { useContext } from 'react';
import '../../styles/components/AchievementsComponent.scss'
import { AchievementsContext } from '../../context/AchievementsContext';

function AchievementsComponent() {
  const achievements = useContext(AchievementsContext)
	return (
		<div className="achievements-component-container">
			<p>Achievements</p>
			<div className='achievements-component-achievements'>
				{
        achievements ? achievements.reverse().map((achievement, i) => (
						<div key={i} className={`achievements-component-achievement`}>
							<p className={`achievements-component-title achievements-component-${achievement.difficulty.toLowerCase()}`}>{achievement.title}</p>
		          <p className={`achievements-component-checkmark`}>{achievement.isComplete ? '✔' : ''}</p>
						</div>
					))
				:
					null
				}
			</div>
		</div>
	);
}

export default AchievementsComponent;
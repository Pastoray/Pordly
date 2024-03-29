import DailyQuestsContextProvider from '../../context/DailyQuestsContext'
import UserContextProvider from '../../context/UserContext';
import DailyQuests from '../pages/DailyQuests';
function DailyQuestsWrapper() {
  return (
    <UserContextProvider>
      <DailyQuestsContextProvider>
          <DailyQuests/>
      </DailyQuestsContextProvider>
    </UserContextProvider>
  );
}

export default DailyQuestsWrapper
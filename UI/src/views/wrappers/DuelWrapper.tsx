import UserContextProvider from '../../context/UserContext';
import Duel from '../pages/Duel';

function DailyQuestsWrapper() {
  return (
    <UserContextProvider>
        <Duel/>
    </UserContextProvider>
  );
}

export default DailyQuestsWrapper
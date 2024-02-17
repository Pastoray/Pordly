import UserContextProvider from '../context/UserContext';
import Duel from './Duel';

function DailyQuestsWrapper() {
  return (
    <UserContextProvider>
        <Duel/>
    </UserContextProvider>
  );
}

export default DailyQuestsWrapper
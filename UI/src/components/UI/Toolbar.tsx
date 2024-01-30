import '../../styles/components/Toolbar.scss'
import { useUser } from '../../hooks/useUser';
function Toolbar() {
    const User = useUser()

    return(
        <div className='toolbar-container'>
            <div className='toolbar-left-side'>
                <p id='toolbar-level'>({1})</p>
                <div className='toolbar-user'>
                    <p>{User!.info.username}</p>
                    <p style={{ fontSize: "0.75rem" }}>King</p>
                </div>
            </div>
            <div className='toolbar-right-side'>
                <div>
                    <p id='toolbar-streak'>1786🔥</p>
                </div>
                <div>
                    <p id='toolbar-gems'>102,546💎</p>
                </div>
                <div>
                    <p id='toolbar-lives'>12❤️</p>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;
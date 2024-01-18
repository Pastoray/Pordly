import { useState } from 'react';
import '../../styles/components/Toolbar.scss'
function Toolbar() {
    const [level, setLevel] = useState(1);

    return(
        <div className='toolbar-container'>
            <div className='toolbar-left-side'>
                <img/>pfp
                <div>
                    <p>Username</p>
                    <p style={{ fontSize: "0.75rem" }}>King</p>
                </div>
                <p style={{ paddingLeft: "4rem" }}>Level {level}</p>
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
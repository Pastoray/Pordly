import { useEffect, useState } from 'react';
import '../../styles/components/Calender.scss'

function Calender() {
    const [date, setDate] = useState(new Date());
    const [today, setToday] = useState(date.getDate())
    const [daysInMonth, setDaysInMonth] = useState(0)
    useEffect(() => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month, 0).getDate()
        setDaysInMonth(days);
    }, [])

    function renderDays() {
        const dayElements = [];
        for (let i = 1; i <= daysInMonth; i++) {
            if (today > i) {
                dayElements.push(<p key={i} className='prev calender-day'>&#x2713;</p>);
            } else if (today === i){
                dayElements.push(<p key={i} className='today calender-day'>{i}</p>);
            } else {
                dayElements.push(<p key={i} className='next calender-day'>&#x2717;</p>);
            }
        }
        return dayElements;
    }
    return(
        <div className="calender-container">
            <p>Calender</p>
            <div className='calender-days'>
                {renderDays()}
            </div>
        </div>
    );
}

export default Calender;
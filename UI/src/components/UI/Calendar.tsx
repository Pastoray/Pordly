import { useEffect, useState } from 'react';
import '../../styles/components/Calendar.scss'
import { fetch_calendar } from '../../utils/Index';

function Calendar() {
    const [calendar, setCalendar] = useState([])
    const [days, setDays] = useState(0)

    useEffect(() => {
        async function getCalendar() {
            const { daily_quests, days_this_month } = await fetch_calendar()

            setCalendar(daily_quests)
            setDays(days_this_month)
        }
        getCalendar()
    }, [])

    function render_days() {
        const dayElements = [];
        for (let i = 1; i <= days; i++) {
            if (i <= calendar.length) {
                if (i == calendar.length) {
                    if (calendar[i - 1]) {
                        dayElements.push(<p key={i} className='calendar-day-done calendar-day'>&#x2713;</p>);
                    } else {
                        dayElements.push(<p key={i} className='calendar-day-today calendar-day'>{i}</p>);
                    }
                } else {
                    if (calendar[i - 1]) {
                        dayElements.push(<p key={i} className='calendar-day-done calendar-day'>&#x2713;</p>);
                    } else {
                        dayElements.push(<p key={i} className='calendar-day-undone calendar-day'>&#x2717;</p>);
                    }
                }
            } else {
                dayElements.push(<p key={i} className='calendar-day'>{i}</p>);
            }
        }
        return dayElements;
    }

    return(
        <div className="calendar-container">
            <p>Calendar</p>
            <div className='calendar-days'>
                {render_days()}
            </div>
        </div>
    );
}

export default Calendar;
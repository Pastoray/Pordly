import PropTypes from 'prop-types';
import '../../styles/components/Card.scss'
import { useEffect, useState } from 'react';

type CardProps = {
    title: string,
    doneCount: number,
    totalCount: number
}
function Card({ title, doneCount, totalCount }: CardProps) {
    const [progressPercentage, setProgressPercentage] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            const progress = (doneCount / totalCount) * 100;
            setProgressPercentage(progress);
        }, 2000);
    }, [doneCount])
    return(
        <>
            <div className='card-container'>
                <div className='card-title-container'>
                    <p id='title'>{title}</p>
                </div>
                <div className='card-loading-bar'>
                    <p>{doneCount}/{totalCount}</p>
                    <div className='progress-bar' style={{ width: `${progressPercentage}%` }}>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Card;

Card.propTypes = {
    title: PropTypes.string.isRequired,
    doneCount: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired
}
import { useEffect, useState } from 'react';
import { CardProps } from '../../types/Index';
import '../../styles/components/Card.scss'
import PropTypes from 'prop-types';

function Card({ title, doneCount, totalCount }: CardProps) {
    const [progressPercentage, setProgressPercentage] = useState(0);
    useEffect(() => {
        const progress = (doneCount / totalCount) * 100;
        setProgressPercentage(progress);
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
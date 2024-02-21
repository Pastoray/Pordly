import { useEffect, useState } from 'react';
import Toolbar from '../../components/UI/Toolbar';
import { buy_booster, fetch_boosters, get_user } from '../../utils/Index';
import { Booster } from '../../types/Index';
import '../../styles/pages/Shop.scss'

function Shop() {
    const [boosters, setBoosters] = useState<Booster[]>([]);
    const [userValidated, setUserValidated] = useState(false);

    useEffect(() => {
        async function user_exists() {
            const result = await get_user()
            if (result === undefined) {
                window.location.href = '/login'
            } else {
                setUserValidated(true)
            }
        }
        user_exists()
    })

    useEffect(() => {
        async function fetch_all_boosters() {
            const boosters = await fetch_boosters()
            setBoosters(boosters)
        }
        fetch_all_boosters()
    }, [])

    return(
        <>
            {
            userValidated ?
                <div className='shop-container'>
                    <Toolbar/>
                    <div className='shop'>
                        <div>
                            <p id='shop-boosters'>Boosters</p>
                            <div className='shop-boosters'>
                                {
                                boosters ?
                                    boosters.map((booster, i) => (
                                            <div className='shop-booster' key={i} style={{border: `3px solid ${booster.color}`}} onClick={() => {
                                                buy_booster(booster.id)
                                            }}>
                                                <p id='shop-booster-title' style={{color: booster.color}}>- {booster.title} -</p>
                                                <p id='shop-booster-info'>{booster.category.toLocaleUpperCase()} &times;{booster.multiplier}</p>
                                                <p id='shop-booster-description'>{booster.description}</p>
                                                <p id='shop-booster-price'>{booster.price} 💎</p>
                                            </div>
                                        )
                                    )
                                :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            :
                null
            }
        </>
    ); 
}

export default Shop;
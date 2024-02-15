import { useEffect, useState } from 'react';
import Toolbar from '../components/UI/Toolbar';
import '../styles/pages/Shop.scss'
import { buy_booster } from '../utils/Index';
import { Booster } from '../types/Index';

function Shop() {
    const [boosters, setBoosters] = useState<Booster[]>([]);
    useEffect(() => {
        async function fetch_boosters() {

            const data = await fetch("http://127.0.0.1:8080/all/boosters", {
            method: "GET",
            headers: {
                    "Content-Type": "application/json",
                }
            })
            const response = await data.json()
            setBoosters(response)
        }
        fetch_boosters()
    }, [])

    return(
        <>
            <div className='shop-container'>
                <Toolbar/>
                <div className='shop'>
                    <div>
                        <p id='shop-boosters'>Boosters</p>
                        <div className='shop-boosters'>
                            {
                            boosters ?
                                boosters.map((booster, i) => (
                                        <div className='shop-booster' key={i} onClick={() => {
                                            buy_booster(booster.id)
                                        }}>
                                            <p id='shop-booster-title'>- {booster.title} -</p>
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
        </>
    ); 
}

export default Shop;
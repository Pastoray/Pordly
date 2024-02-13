import { useState } from 'react';
import Toolbar from '../components/UI/Toolbar';
import '../styles/pages/Shop.scss'

function Shop() {
    const [boosters, setBoosters] = useState(Array.from({ length: 10 }).fill(''));
    const [items, setItems] = useState(Array.from({ length: 10 }).fill(''));
    return(
        <>
            <div className='shop-container'>
                <Toolbar/>
                <div className='shop'>
                    <div>
                        <p id='shop-boosters'>Boosters</p>
                        <div className='shop-boosters'>
                            {
                            boosters.map((booster, i) => (
                                    <div className='shop-booster' key={i}>
                                        <p id='shop-booster-title'>XP Booster x2</p>
                                        <p id='shop-booster-description'>Boosts experience received by two times</p>
                                        <p id='shop-booster-price'>1000 💎</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div>
                        <p id='shop-items'>Items</p>
                        <div className='shop-items'>
                            {
                            items.map((item, i) => (
                                    <div className='shop-item' key={i}>
                                        <p id='shop-item-title'>Titles Lives Name Nexus..</p>
                                        <p id='shop-item-description'>The Crimson Conqueror</p>
                                        <p id='shop-item-price'>1000 💎</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    ); 
}

export default Shop;
import React, { useState, useEffect } from 'react';
import { getBalance } from '../../api/gold';
import styles from './index.module.css';

const GoldBalance: React.FC = () => {
    const [gold, setGold] = useState<number>(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await getBalance();
                setGold(data.gold);
            } catch (error) {
                console.error('Failed to fetch gold balance:', error);
            }
        };
        fetchBalance();
    }, []);

    return (
        <div className={styles.balance}>
            💰 {gold}
        </div>
    );
};

export default GoldBalance;
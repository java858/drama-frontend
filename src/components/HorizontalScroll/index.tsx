import React from 'react';
import styles from './index.module.css';

interface HorizontalScrollProps {
    children: React.ReactNode;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children }) => {
    return (
        <div className={styles.scrollContainer}>
            <div className={styles.scrollInner}>{children}</div>
        </div>
    );
};

export default HorizontalScroll;
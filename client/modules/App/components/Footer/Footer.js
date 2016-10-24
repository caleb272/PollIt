import React from 'react';

// Import Style
import styles from './Footer.css';

// Import Images
import bg from '../../header-bk.png';

export function Footer() {
  return (
    <div className={styles.footer}>
      <p>&copy; 2016 &middot; Caleb Martin</p>
    </div>
  )
}

export default Footer;

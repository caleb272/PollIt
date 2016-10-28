import React from 'react';

// Import Style
import styles from './Footer.css';

export function Footer() {
  return (
    <div className={styles.footer}>
      <span>
        Made with <i className={`${styles.heart} fa fa-heart`} aria-hidden="true" /> by
        <a
          href="http://caleb272.github.io/portfolio/"
          target="_blank"
        > Caleb Martin
        </a>
      </span>
      <a
        href="https://github.com/caleb272"
        target="_blank"
      >
        <i className={`${styles['contact-icons']} contact-icons fa fa-2x fa-github-alt`} aria-hidden="true" />
      </a>
    </div>
  )
}

export default Footer

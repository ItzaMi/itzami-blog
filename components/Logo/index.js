import React from "react"
import Link from "next/link"

import css from "./logo.module.css"

const Logo = ({ className }) => {
  return (
    <div className={`${css.host} ${className}`}>
      <Link href="/">
        <a className={css.name}>
          Itza
          <br />
          Mi
        </a>
      </Link>
    </div>
  )
}

export default Logo

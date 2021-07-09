import React from "react"
import Link from "next/link"

import css from "./logo.module.css"

const Logo = () => {
  return (
    <div className={css.host}>
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

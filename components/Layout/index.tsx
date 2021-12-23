import { FC } from 'react'

import NavBar from '../NavBar'

import css from './layout.module.css'

interface Props {
  children: any
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className={css.host}>
      <NavBar />
      {children}
    </div>
  )
}

export default Layout

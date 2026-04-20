import { FC, ReactNode } from 'react'

import NavBar from '../NavBar'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="mx-auto w-full max-w-[840px] min-h-[calc(100vh-40px)] px-5 pt-10 max-[880px]:mx-0 max-[880px]:max-w-[calc(100%-40px)] max-[500px]:max-w-full">
      <NavBar />
      {children}
    </div>
  )
}

export default Layout

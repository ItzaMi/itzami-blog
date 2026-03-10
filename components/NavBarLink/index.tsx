import { FC } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  path: string
  text: string
}

const NavBarLink: FC<Props> = ({ path, text }) => {
  const router = useRouter()
  const isActive = router.pathname === path

  return (
    <Link
      href={path}
      className={`rounded-md px-3 py-2 text-sm leading-[17px] tracking-tight text-primary no-underline transition-all duration-200 ease-in hover:bg-hover-strong ${
        isActive ? 'bg-hover font-medium' : ''
      }`}
    >
      {text}
    </Link>
  )
}

export default NavBarLink

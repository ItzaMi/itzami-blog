import css from "./nav.module.css"

const Nav = () => {
  return (
    <div className={css.host}>
      <p className={css.link}>Blog</p>
      <p className={css.link}>About</p>
    </div>
  )
}

export default Nav

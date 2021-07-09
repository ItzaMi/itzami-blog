import GitHub from "../Icons/Github"
import YouTube from "../Icons/Youtube"
import Dribbble from "../Icons/Dribbble"
import Twitter from "../Icons/Twitter"

import css from "./info.module.css"

const Info = () => {
  return (
    <div className={css.host}>
      <h1 className={css.title}>Homepage</h1>
      <div className={css.iconContainer}>
        <a
          href="https://github.com/itzami"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GitHub />
        </a>
        <a
          href="https://www.youtube.com/channel/UCwnDdBqfYvxIzDXXtyQ75fg"
          rel="noopener noreferrer"
          target="_blank"
        >
          <YouTube />
        </a>
        <a
          href="https://dribbble.com/ItzaMi"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Dribbble />
        </a>
        <a
          href="https://twitter.com/HeyItzaMi"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Twitter />
        </a>
      </div>
    </div>
  )
}

export default Info

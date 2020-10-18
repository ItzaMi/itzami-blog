module.exports = {
  siteMetadata: {
    title: `ItzaMi - A web development blog with a lot more stuff in it`,
    description: `Hi, I'm Rui and I'm a self-taught front-end developer with a Master's Degree in Psychology. Here's my place where I share my ideas!`,
    author: `Rui Sousa <rros00@gmail.com>`,
    url: "https://www.itzami.com/",
    image: "/icons/icon-500x500.png",
    twitterUsername: "@HeyItzaMi",
  },
  plugins: [
    "gatsby-plugin-use-dark-mode",
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/content`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/icons/icon-500x500.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sass`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}

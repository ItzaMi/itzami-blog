export type ProjectStatus =
  | 'active'
  | 'paused'
  | 'shipped'
  | 'retired'
  | 'failed'
  | 'not-for-profit'
  | 'idea'

export interface Project {
  year: string
  title: string
  status: ProjectStatus
  group: 'ongoing' | 'closed'
  kind: string
  description: string
  href?: string
}

export const projects: Project[] = [
  {
    year: '2026',
    title: 'ScreenEdit',
    status: 'active',
    group: 'ongoing',
    kind: 'iOS',
    description:
      'Screenshot editor for framing app screens and making them presentable for social media. Useful for indie devs who like sharing their work.',
    href: 'https://screen-edit.itzami.com/',
  },
  {
    year: '2026',
    title: 'Readable CSV',
    status: 'failed',
    group: 'closed',
    kind: 'web',
    description:
      'Formats CSV files into readable tables and creates shareable links so people can pass data around without sending raw spreadsheet exports.',
  },
  {
    year: '2026',
    title: 'Waddle',
    status: 'failed',
    group: 'closed',
    kind: 'iOS and web',
    description:
      'Helped people apply for jobs by analyzing resumes, rewriting cover letters around a job opening, and preparing likely interview questions.',
  },
  {
    year: '2026',
    title: 'Pipeta',
    status: 'not-for-profit',
    group: 'ongoing',
    kind: 'macOS',
    description:
      'Color utility for picking colors, organizing palettes, checking formats, exploring harmonies, and reviewing WCAG contrast ratings.',
    href: 'https://pipeta.app',
  },
  {
    year: '2025',
    title: 'Buggy',
    status: 'active',
    group: 'ongoing',
    kind: 'iOS',
    description:
      'Private baby tracker for parents who want feeding, sleep, diaper, and growth data to stay on their own phone instead of someone else’s servers.',
    href: 'https://buggybabby.app',
  },
  {
    year: '2025',
    title: 'Identifiers',
    status: 'active',
    group: 'ongoing',
    kind: 'iOS',
    description:
      'Series of identifier apps for experimenting with marketing, user flows, and validation. Some have already been removed after losing their reason to keep existing.',
  },
  {
    year: '2025',
    title: 'O Meu Baby Shower',
    status: 'not-for-profit',
    group: 'ongoing',
    kind: 'web',
    description:
      'Lets people create baby shower events with gift lists and RSVPs.',
    href: 'https://omeubabyshower.pt',
  },
  {
    year: '2025',
    title: 'X-tra',
    status: 'not-for-profit',
    group: 'ongoing',
    kind: 'web',
    description:
      'Browser extension meant to enhance X analytics and features.',
    href: 'https://x-tra.itzami.com/',
  },
]

export const apps = projects.filter((project) => project.kind === 'app')

export const reading = [
  {
    title: 'Currently reading',
    entries: ['The Creative Act', 'Designing Data-Intensive Applications'],
  },
  {
    title: 'Recently finished',
    entries: ['Tomorrow, and Tomorrow, and Tomorrow', 'The Making of Prince of Persia'],
  },
]

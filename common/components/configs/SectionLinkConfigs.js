import Section from '../enums/Section.js'

const SectionLinkConfigs = [
  {
    section: Section.FindProjects,
    title: 'DISCOVER',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.MyProjects,
    title: 'MY PROJECTS',
    showOnlyWhenLoggedIn: true
  }
];

export default SectionLinkConfigs;

import Section from '../enums/Section.js'

const SectionLinkConfigs = [
  {
    section: Section.FindProjects,
    title: 'FIND PROJECT',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.MyProjects,
    title: 'MY PROJECTS',
    showOnlyWhenLoggedIn: true
  }
];

export default SectionLinkConfigs;

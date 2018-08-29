import Section from '../enums/Section.js'

const SectionLinkConfigs = [
  {
    section: Section.FindProjects,
    title: 'FIND PROJECTS',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.MyProjects,
    title: 'MY PROJECTS',
    showOnlyWhenLoggedIn: true
  },
  {
    section: Section.EditProfile,
    title: 'MY PROFILE',
    showOnlyWhenLoggedIn: true
  }
];

export default SectionLinkConfigs;

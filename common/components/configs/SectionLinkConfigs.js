import Section from '../enums/Section.js'

const SectionLinkConfigs = [
  {
    section: Section.FindProjects,
    title: 'Find Projects',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.MyProjects,
    title: 'My Projects',
    showOnlyWhenLoggedIn: true
  },
  {
    section: Section.EditProfile,
    title: 'My Profile',
    showOnlyWhenLoggedIn: true
  }
];

export default SectionLinkConfigs;

import Section from '../enums/Section.js'

const SectionLinkConfigs = [
  {
    section: Section.FindProjects,
    title: 'Find Projects',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.CreateProject,
    title: 'Create Project',
    showOnlyWhenLoggedIn: false
  },
   {
    section: Section.CreateOrganization,
    title: 'Create Organization',
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
  },
  {
    section: Section.AboutUs,
    title: 'About Us',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.Press,
    title: 'News',
    showOnlyWhenLoggedIn: false
  }
];

export default SectionLinkConfigs;

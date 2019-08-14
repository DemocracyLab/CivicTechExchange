import Section from '../enums/Section.js'

export type SectionLinkConfig = {|
  section: string,
  title: string,
  showOnlyWhenLoggedIn: boolean,
  showOnPages: ?$ReadOnlyArray<string>
|}

const SectionLinkConfigs: $ReadOnlyArray<SectionLinkConfig> = [
  {
    section: Section.FindProjects,
    title: 'Projects',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.FindEvents,
    title: 'Events',
    showOnlyWhenLoggedIn: false
  },

  {
    section: Section.FindGroups,
    title: 'Groups',
    showOnlyWhenLoggedIn: false
  },
  {
    section: Section.CreateProject,
    title: 'Create Project',
    showOnlyWhenLoggedIn: false,
    showOnPages: [Section.FindProjects, Section.CreateProject]
  },
  {
    section: Section.CreateEvent,
    title: 'Create Event',
    showOnlyWhenLoggedIn: false,
    showOnPages: [Section.FindEvents, Section.CreateEvent]
  },
  {
    section: Section.CreateGroup,
    title: 'Create Group',
    showOnlyWhenLoggedIn: false,
    showOnPages: [Section.FindGroups, Section.CreateGroup]
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

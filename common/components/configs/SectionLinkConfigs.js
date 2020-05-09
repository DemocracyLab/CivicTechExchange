import Section from '../enums/Section.js'
import type {SectionType} from "../enums/Section";

type SectionLinkConfigEntry = {|
  section: SectionType,
  title: string,
  showOnlyWhenLoggedIn: ?boolean,
  showAdminOnly: ?boolean
|};

const SectionLinkConfigs: $ReadOnlyArray<SectionLinkConfigEntry> = [
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
    section: Section.CreateEvent,
    title: 'Create Event',
    showAdminOnly: true
  },
  {
    section: Section.CreateGroup,
    title: 'Create Group',
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

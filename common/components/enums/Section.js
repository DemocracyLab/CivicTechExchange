const Section = {
  CreateProject: 'CreateProject',
  Landing: 'Landing',
  FindProjects: 'FindProjects',
  MyProjects: 'MyProjects',
  Profile: 'Profile',
  Inbox: 'Inbox',
  SignIn: 'SignIn',
};

export type SectionType = $Keys<typeof Section>;

export default Section;

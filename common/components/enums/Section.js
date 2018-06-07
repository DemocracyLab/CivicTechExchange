const Section = {
  AboutProject: 'AboutProject',
  CreateProject: 'CreateProject',
  EditProject: 'EditProject',
  Landing: 'Landing',
  FindProjects: 'FindProjects',
  MyProjects: 'MyProjects',
  Profile: 'Profile',
  Inbox: 'Inbox',
  SignUp: 'SignUp',
  LogIn: 'LogIn',
  ResetPassword: 'ResetPassword',
  ChangePassword: 'ChangePassword'
};

export type SectionType = $Keys<typeof Section>;

export default Section;

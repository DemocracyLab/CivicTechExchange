const Section = {
  AboutProject: 'AboutProject',
  AboutGroup: 'AboutGroup',
  AboutUs: 'AboutUs',
  CreateProject: 'CreateProject',
  EditProject: 'EditProject',
  EditGroup: 'EditGroup',
  Landing: 'Landing',
  FindProjects: 'FindProjects',
  MyProjects: 'MyProjects',
  MyGroups: 'MyGroups',
  Profile: 'Profile',
  Inbox: 'Inbox',
  SignUp: 'SignUp',
  LogIn: 'LogIn',
  ResetPassword: 'ResetPassword',
  ChangePassword: 'ChangePassword',
  EditProfile: 'EditProfile',
  SignedUp: 'SignedUp',
  EmailVerified: 'EmailVerified',
  PartnerWithUs: 'PartnerWithUs',
  Donate: 'Donate',
  ThankYou: 'ThankYou',
  Press: 'Press',
  ContactUs: 'ContactUs',
  CreateGroup: 'CreateGroup',
  CreateEvent: 'CreateEvent',
};

export type SectionType = $Keys<typeof Section>;

export default Section;

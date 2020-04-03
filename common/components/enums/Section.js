const Section = {
  AboutProject: 'AboutProject',
  AboutUs: 'AboutUs',
  CreateProject: 'CreateProject',
  EditProject: 'EditProject',
  Home: 'Home',
  FindProjects: 'FindProjects',
  MyProjects: 'MyProjects',
  Profile: 'Profile',
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
  LiveEvent: 'LiveEvent'
};

export type SectionType = $Keys<typeof Section>;

export default Section;

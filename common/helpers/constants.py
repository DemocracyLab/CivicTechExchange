from enum import Enum


class TagCategory(Enum):
    PROJECT_STAGE = 'Project Stage'
    PROJECT_STATUS = 'Status'
    PROJECT_NEED = 'Project Need'
    PROJECT_CATEGORY = 'Project Category'
    ISSUE_ADDRESSED = 'Issue(s) Addressed'
    TECHNOLOGIES_USED = 'Technologies Used'
    SOFTWARE_LICENSE = 'Software License'
    ORGANIZATION = 'Organization'
    ORGANIZATION_TYPE = 'Organization Type'


# TODO: Keep in sync with /common/components/enums/Section.js
class FrontEndSection(Enum):
    LogIn = 'LogIn'
    ResetPassword = 'ResetPassword'
    ChangePassword = 'ChangePassword'
    AboutProject = 'AboutProject'
    IframeProject = 'IframeProject'
    SignedUp = 'SignedUp'
    AboutUs = 'AboutUs'
    FindProjects = 'FindProjects'
    Donate = 'Donate'
    ContactUs = 'ContactUs'
    Home = "Home"
    CreateProject = 'CreateProject'
    MyProjects = 'MyProjects'
    Profile = 'Profile'
    SignUp = 'SignUp'
    EditProfile = 'EditProfile'
    ThankYou = 'ThankYou'
    EmailVerified = 'EmailVerified'
    Error = 'Error'
    AboutGroup = 'AboutGroup'
    IframeGroup = 'IframeGroup'
    FindGroups = 'FindGroups'
    FindEvents = 'FindEvents'
    CreateEvent = 'CreateEvent'
    AboutEvent = 'AboutEvent'
    CreateGroup = 'CreateGroup'
    MyGroups = 'MyGroups'
    MyEvents = 'MyEvents'
    Companies = 'Companies'
    AddUserDetails = 'AddUserDetails'
    VideoOverview = 'VideoOverview'
    AboutEventProject = 'AboutEventProject'
    CreateEventProject = 'CreateEventProject'
    Privacy = 'Privacy'
    Terms = 'Terms'

    # deprecated
    CorporateHackathon = 'CorporateHackathon'
    PartnerWithUs = 'PartnerWithUs'
    Press = 'Press'

deprecated_page_redirects = {
    'CorporateEvent': FrontEndSection.Companies.value,
    'PartnerWithUs': FrontEndSection.Companies.value
}

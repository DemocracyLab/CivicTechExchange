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


# TODO: Keep in sync with /common/components/enums/Section.js
class FrontEndSection(Enum):
    ResetPassword = 'ResetPassword'
    ChangePassword = 'ChangePassword'

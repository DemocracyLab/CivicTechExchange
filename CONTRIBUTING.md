# Contributing

Thanks for your interest in contributing to DemocracyLab! We're glad you want to help us make our platform even better, and we want to make that process as easy as possible.

## What do I need first?

Make sure you've followed our [Contributor Guide](https://docs.google.com/document/d/1OLQPFFJ8oz_BxpuxRxKKdZ2brmlUkVN3ICTdbA_axxY/edit#) to get the DemocracyLab developer environment set up correctly.

## Where's the best place to ask a question?

Our [Slack](https://join.slack.com/t/democracylab-org/shared_invite/enQtMjQyNDMxOTY2NjA4LTU3MTYyM2EwYTRmMDYwNzUyNjg4YTk1NjEyZTg0ZjgxNzYwY2E5ODIyMTNjZGZkOTI5NTAyZTMwNTNiMWRiZTA). While you can submit an issue through Github, response time will be slower than asking in Slack. Depending on what your question is, try one of these channels:
  - `#design` for anything related to the overall site design, UI, or user experience
  - `#developers` for anything related to the function of the site or a given component, as well as technical assistance on contributing
  - `#general` for anything else


## Pull Request Process

1. Create a branch with `git checkout -b branchname` where the name is something descriptive about the issue your branch will fix, then make and test your changes if possible.
2. Merge the latest version of master, to make sure your branch is up to date:
  ```
  git checkout master
  git pull origin master
  git checkout _<feature branch>_
  git merge master
  ```
3. Resolve any merge conflicts if they exist, then test to make sure your feature branch still works correctly. Please make sure your PR includes the `bundle.js` file (it's required for deployment) and then `git push origin _<_feature branch>_`
4. On Github, create a pull request from your feature branch. Make sure to summarize your changes you made, and if there's anything specific you want reviewed or tested, note that in the PR.
5. Post in Slack (in `#developers`) that your PR is ready for review! All pull requests must be reviewed and approved prior to merging. If any changes are requested, those will be made through the Github review system.  
6. When approved, your branch will be merged into master and you're done! Thanks for contributing! :)


## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [hello@democracylab.org](hello@democracylab.org). All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/

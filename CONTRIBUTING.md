# Contributing

Thanks for your interest in contributing to DemocracyLab! We're glad you want to help us make our platform even better, and we want to make that process as easy as possible.

## What do I need first?

Make sure you've followed our [Contributor Guide](https://docs.google.com/document/d/1OLQPFFJ8oz_BxpuxRxKKdZ2brmlUkVN3ICTdbA_axxY/edit#) to get the DemocracyLab developer environment set up correctly. This guide will also tell you our process for creating and submitting a feature branch on Github.

## Where's the best place to ask a question?

Our [Slack](https://join.slack.com/t/democracylab-org/shared_invite/enQtMjQyNDMxOTY2NjA4LTU3MTYyM2EwYTRmMDYwNzUyNjg4YTk1NjEyZTg0ZjgxNzYwY2E5ODIyMTNjZGZkOTI5NTAyZTMwNTNiMWRiZTA). While you can submit an issue through Github, response time will be slower than asking in Slack. Depending on what your question is, try one of these channels:
  - `#design` for anything related to the overall site design, UI, or user experience
  - `#developers` for anything related to the function of the site or a given component, as well as technical assistance on contributing
  - `#general` for anything else


## Pull Request Process

1. Create a branch with `git checkout -b branchname` where the name is something descriptive about the issue your branch will fix, then make your changes and test them to make sure they work.
2. When you're ready to submit, merge the latest version of master, to make sure your branch is up to date:
    ```
    git checkout master
    git pull origin master
    git checkout <feature branch>
    git merge master
    ```
3. Resolve any merge conflicts if they exist, then test to make sure your feature branch still works correctly. Please make sure your PR includes the `bundle.js` file (it's required for deployment) and then `git push origin <feature branch>`
4. On Github, create a pull request from your feature branch. Make sure to summarize your changes you made, and if there's anything specific you want reviewed or tested, note that in the PR.
5. Post in Slack (in `#developers`) that your PR is ready for review! All pull requests must be reviewed and approved prior to merging. If any changes are requested, those will be made through the Github review system.  
6. When approved, your branch will be merged into master and you're done! Thanks for contributing! :)

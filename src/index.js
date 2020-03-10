const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const pkg = require('../package.json');

const ACTION_UA = `${pkg.name}/${pkg.version}`;

// Sets the required env info for Percy to work correctly
function setPercyBranchBuildInfo(pullRequestNumber) {
  if (!!pullRequestNumber) {
    let prBranch = github.context.payload.pull_request.head.ref;

    core.exportVariable('PERCY_BRANCH', prBranch);
    core.exportVariable('PERCY_PULL_REQUEST', pullRequestNumber);
  } else {
    core.exportVariable('PERCY_BRANCH', github.context.payload.ref.replace('refs/heads/', ''));
  }
}

(async () => {
  try {
    let percyFlags = core.getInput('percy-flags');
    let customCommand = core.getInput('custom-command');
    let storybookFlags = core.getInput('storybook-flags');
    let workingDir = core.getInput('working-directory');
    let pullRequestNumber = github.context.payload.number;
    let execOptions = {
      cwd: workingDir,
      windowsVerbatimArguments: true
    };

    // Set the CI builds user agent
    core.exportVariable('PERCY_GITHUB_ACTION', ACTION_UA);

    // Set the PR # (if available) and branch name
    setPercyBranchBuildInfo(pullRequestNumber);

    if (customCommand) {
      // Run the passed command
      await exec.exec(`${customCommand}`, [], execOptions);

      return;
    } else {
      // happy path
      let npxPath = await io.which('npx', true);

      // Build the storybook project
      await exec.exec(`"${npxPath}" build-storybook ${storybookFlags}`, [], execOptions);
      // Run Percy over the build output
      await exec.exec(`"${npxPath}" @percy/storybook ${percyFlags}`, [], execOptions);

      return;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();

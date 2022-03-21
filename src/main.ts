import * as core from '@actions/core'
import * as github from "@actions/github"
import { Octokit } from '@octokit/core'
import { PaginateInterface } from '@octokit/plugin-paginate-rest'
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types'
import { RequestError } from "@octokit/request-error"

async function run(): Promise<void> {
    const separator = core.getInput('separator')
    const labelsStringList = core.getInput('labels-list')
    const issueNumber = parseInt(core.getInput('issue-number'), 10)
    const labelsArray = labelsStringList.split(separator)
    const token = core.getInput('token')
    const octokit = github.getOctokit(token)
    let prLabelList: (string | undefined)[] = []

    prLabelList = await getAllLabels(issueNumber, labelsArray, octokit)

    labelsArray.forEach(element => {
      removeLabel(octokit, issueNumber, element);
    })
      
}

run()

async function removeLabel(octokit: { [x: string]: any; } & { [x: string]: any; } & Octokit & RestEndpointMethods & { paginate: PaginateInterface; }, issueNumber: number, element: string): Promise<void> {
  try {
    const response = await octokit.issues.removeLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issueNumber,
      name: element
    });
  } catch (error) {
    throwError(error)
  }
}

async function getAllLabels(issueNumber: number, labelsArray: string[], octokit: { [x: string]: any; } & { [x: string]: any; } & Octokit & RestEndpointMethods & { paginate: PaginateInterface; }): Promise<(string | undefined)[]> {
  if (!Number.isNaN(issueNumber) && labelsArray.length > 0) {
    try {
      const response = await octokit.issues.listLabelsOnIssue({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issueNumber,
        per_page: 100
      });
      return response.data.map(prLabel => {
        if (labelsArray.includes(prLabel.name)) {
          return prLabel.name;
        }
      });
    } catch (error) {
      throwError(error);
    }
  } else {
    core.setFailed('Inputs could not be parsed properly');
  }
  return []
}

function throwError(error: unknown) {
  if (error instanceof RequestError) {
    core.setFailed(`Error (code ${error.status}): ${error.message}`);
  } else {
    core.setFailed('Unknown Error');
  }
}


import * as core from '@actions/core'
import * as github from "@actions/github"
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types'
import { RequestError } from "@octokit/request-error"

async function run(): Promise<void> {
    const separator = core.getInput('separator')
    const issueNumber = parseInt(core.getInput('issue-number'), 10)
    const token = core.getInput('token')
    const labelsStringList = core.getInput('labels-list')
    const labelsArray = labelsStringList.split(separator)
    const newLabelsStringList = core.getInput('new-labels-list')
    const newLabelsArray = newLabelsStringList.split(separator)
    const octokit = github.getOctokit(token)
    let prLabelList: (string | undefined)[] = []

    const allLabelList = await getAllLabels(issueNumber, octokit)
    prLabelList = allLabelList.map(prLabel => {
      if (labelsArray.includes(prLabel.name)) {
        return prLabel.name
      }
    })

    prLabelList.forEach((element, index) => {
      if(!(typeof element === 'undefined' || element === null)){
        if (newLabelsArray.includes(element)) {
          prLabelList.splice(index,1)
          const newLabelIndex = newLabelsArray.indexOf(element)
          if (newLabelIndex !== -1) {
            newLabelsArray.splice(newLabelIndex,1)
          }
        }
      }
    })

    prLabelList.forEach(label => {
      if(!(typeof label === 'undefined' || label === null)){
        removeLabel(octokit, issueNumber, label!)
      }
    })
    
    if (newLabelsArray.length > 0) {
      addLabel(octokit, issueNumber, newLabelsArray)
    }
}

run()

async function removeLabel(octokit: RestEndpointMethods, issueNumber: number, label: string) {
  try {
    const response = await octokit.issues.removeLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issueNumber,
      name: label
    })
  } catch (error) {
    throwError(error)
  }
}

async function addLabel(octokit: RestEndpointMethods, issueNumber: number, labels: string[]) {
  try {
    const response = await octokit.issues.addLabels({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: issueNumber,
      labels: labels
    })
  } catch (error) {
    throwError(error)
  }
}

async function getAllLabels(issueNumber: number, octokit: RestEndpointMethods) {
  if (!Number.isNaN(issueNumber)) {
    try {
      const response = await octokit.issues.listLabelsOnIssue({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issueNumber,
        per_page: 100
      })
      return response.data
    } catch (error) {
      throwError(error)
    }
  } else {
    core.setFailed('Inputs could not be parsed properly')
  }
  return []
}

function throwError(error: any) {
  if (error instanceof RequestError) {
    core.setFailed(`Error (code ${error.status}): ${error.message}`)
  } else {
    core.setFailed('Unknown Error')
  }
}


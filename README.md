Use this action to remove labels based on their previous presence. This helps prevent unnecessary label removals. It only removes after ensuring that the label was already present in the issue.

There are five inputs and all of them are required.

```
  token:
    description: 'Github token'
  separator:
    description: 'Separator to be used to extract label names from the input'
  labels-list:
    description: 'A string of all labels that are to be checked with, separated with the passed separator'
  issue-number:
    description: 'Issue number'
  new-labels-list:
    description: 'Updated labels list'
```

Example usage

```
- name: Label removal
        uses: denil-ct/labels-remover@main
        with:
          token: ${{ github.token }}
          separator: ';'
          labels-list: 'Run Workflow;Run Succeeded;Run Failed'
          issue-number: ${{ github.event.number }}
          new-labels-list: 'Run Succeeded'
```
This example will ensure that if `Run Succeeded` label is already present in the issue, it won't be removed.


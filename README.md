Use this action to remove labels based on their previous presence. This helps prevent unnecessary label removals. It only removes after ensuring that the label was already present in the issue.

There are four inputs and both of them are required.

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
---
name: "Bug report"
title: ""
labels: bug
assignees: ""
body:
  - type: textarea
    id: expected
    attributes:
      label: Expected
      description: Describe the output you expected
    validations:
      required: true
  - type: textarea
    id: inputs
    attributes:
      label: Inputs
      description: Describe all your inputs, including module, framework, linting, and testing setup.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Actual
      description: Describe what the actual output was. Provide any suggestions on how it could be better.
    validations:
      required: true
---

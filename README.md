# Percy for Storybook

## Deprecated

⚠️ This action is only required if you're using an older SDK not using Percy CLI. For the Storybook SDK, anything v4.0+ will not need this action. 3.x and below _will_ need this action. 

A GitHub action to visually test Storybook with Percy.

## Quick start

To use the Percy exec GitHub action you will need to add a new step to your
actions config using the `percy/storybook-action` action. Using the default
settings, you can just use the action directly. You will also need to set your
`PERCY_TOKEN` in your GitHub projects settings.

This is a sample config using the default setup:

``` yaml
name: CI
on: [push, pull_request]
jobs:
  default:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: Install
        run: yarn
      - name: Percy Test
        uses: percy/storybook-action@v0.1.6
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

And this is a setup that passes a custom command, which allows for any
configuration:

``` yaml
name: CI
on: [push, pull_request]
jobs:
  custom_command:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: Install
        run: yarn
      - name: Percy Test
        uses: percy/storybook-action@v0.1.6
        with:
          custom-command: 'yarn storybook:percy'
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

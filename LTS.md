# LTS

This is the LTS fork of jquery-ujs.

## Supported jQuery versions

We test our patches against the following jQuery versions:

* 1.8.0
* 1.8.1
* 1.8.2
* 1.8.3
* 1.9.0
* 1.9.1
* 1.10.0
* 1.10.1
* 1.10.2
* 1.11.0
* 2.0.0
* 2.1.0
* 3.0.0

## Running tests

```
# Runs all Qunit tests in all versions in chrome with capybara
$script/run_tests

# Runs Qunit tests for 1.8.0 & 1.8.1
$VERSIONS=1.8.0,1.8.1 script/run_tests

# Runs suite with :selenium-chrome
$NO_HEADLESS=1 script/run_tests
```

## Releasing a new patch version

Running `npm version patch -m 'Upgrade to %s for CVE-1234'` will:

1. Execute all tests
2. Create a patch version bump commit
3. Push the commit
4. Publish the package

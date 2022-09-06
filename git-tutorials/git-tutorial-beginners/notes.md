## Configuring Git

| System    | Global                      | Local              |
| --------- | --------------------------- | ------------------ |
| All Users | Current User's Repositories | Current Repository |

examples:-

1. git config --global user.name syafiqhadzir
2. git config --global user.email syafiqhadzir@live.com.my
3. git config --global core.editor "code --wait"
4. git config --global -e

**core.autocrlf**

\r = carriage return (Windows) : git config core.autocrlf true
\n = line feed : git config core.autocrlf input

## Getting Help

1. git config --help

## Staging Files

1. git status # tracking files
2. git add # staging files

## Committing Best Practices

https://www.conventionalcommits.org/en/v1.0.0/

## Skipping the Staging Area

1. git commit -S -am ""

## Removing Files

1. git ls-files # files in staging area
2. git rm # remove files in both local & staging area
3. git rm --cached -r # only remove files from staging area

## Short Status

1. git status -s # show status concisely

## Viewing the Staged and Unstaged Changes

1. git diff --cached

## Visual Diff Tools

1. git config --global diff.tool vscode
2. git difftool
3. git difftool --staged

## Viewing the History

1. git log
2. git log --oneline
2. git log --oneline --reverse

## Viewing a Commit

1. git show {refid}
2. git show HEAD # latest commit
3. git ls-tree

## Unstaging Files

1. git reset
2. git restore

## Discarding Local Changes

1. git clean

## Restoring a File to an Earlier Version

1. git restore --source=HEAD~? file...

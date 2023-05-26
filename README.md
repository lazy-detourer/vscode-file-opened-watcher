# File Opened Watcher

A Watcher that show a message if a file opened in the editor matches the pattern.

## Settings

Set the desired pattern in the ```settings.fileOpenedWatcher.patterns``` value.

If not set, a message is showned every time every file is opened.

## Example

Set 'settings.json' file like next.

### All workspace names and all file names:
```
{
  "fileOpenedWatcher.patterns": [
    {
      "workspaceName": ".*",
      "fileName": ".*",
      "message": "${workspaceName}'s file ${fileName} is opened!"
    }
  ]
}
```

### 'javascript' and 'python' file:
```
{
  "fileOpenedWatcher.patterns": [
    {
      "fileName": "\\.js$",
      "message": "Javscript file ${fileName} is opened!"
    },
    {
      "fileName": "\\.py$",
      "message": "Python file ${fileName} is opened!"
    }
  ]
}
```

### When the workspace name contains 'test' without case sensitivity:
```
{
  "fileOpenedWatcher.patterns": [
    {
      "workspaceName": "test",
      "workspaceNameModeModifier": "i",
      "message": "File ${fileName} of test is opened!"
    }
  ]
}
```


### For reference:
```
{
  "fileOpenedWatcher.patterns": [
    {
      "fileName": "[a-z0-9]+",
      "fileNameModeModifier": "i",
      "absoluteFilePath": "[a-z0-9]+",
      "absoluteFilePathModeModifier": "i",
      "relativeFilePath": "[a-z0-9]+",
      "relativeFilePathModeModifier": "i",
      "workspaceName": "[a-z0-9]+",
      "workspaceNameModeModifier": "i",
      "workspacePath": "[a-z0-9]+",
      "workspacePathModeModifier": "i",
      "message": "${fileName}, ${relativeFilePath}, ${absoluteFilePath}, ${workspaceName}, ${workspacePath}",
      "messageType": "error"
    }
  ]
}
```
```messageType``` is one of 'information', 'warning', 'error'.

## Misc

Check IntelliSense and description by JSON Schema in ```settings.json```

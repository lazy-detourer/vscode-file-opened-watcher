// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "open-watcher" is now active!');
	
	const proc = (editor) => {
		try{
			if(!editor) return;
			const fileFullpath = editor.document.fileName;
			const patterns = vscode.workspace.getConfiguration().get('fileOpenedWatcher.patterns') || [];
			if(!patterns.length) patterns.push({});
			
			const targets = {
				fileName: fileFullpath.split(path.sep).pop(),
				workspaceName: vscode.workspace.name || '',
				workspacePath: (vscode.workspace.workspaceFolders || []).map((item) => item.uri.fsPath)
			};
			targets.absoluteFilePath = fileFullpath.substring(0, fileFullpath.length - targets.fileName.length - path.sep.length);
			targets.relativeFilePath = targets.workspacePath
				.filter((item) => targets.absoluteFilePath.startsWith(item))
				.map((item) => targets.absoluteFilePath.substring(item.length + path.sep.length))
			;

			for(let i = 0; i < patterns.length; i++){
				const pattern = patterns[i] || {};

				const regExp = Object.keys(targets)
					.filter((item) => pattern[item])
					.map((item) => {
						try{
							return [0, null, targets[item], new RegExp(pattern[item], pattern[item + 'ModeModifier'])];
						}catch(e){
							if(e.constructor.name == 'SyntaxError'){
								if(e.message.startsWith('Invalid regular expression')) return [1, item];
								if(e.message.startsWith('Invalid flags supplied to RegExp constructor')) return [2, item];
							}
							throw e;
						}
					})
				;

				const regExpErr = regExp.find(([item]) => item != 0);
				if(regExpErr){
					const [state, name] = regExpErr;
					vscode.window.showErrorMessage(state == 1 ?
						`settings.openWatcher.patterns[${i}].${name} = "${pattern[name]}" is invalid regular expression pattern.` :
						`settings.openWatcher.patterns[${i}].${name}ModeModifier = "${pattern[name + 'ModeModifier']}" is invalid regular expression mode modifier.`
					);
					return;
				}

				if(regExp.map((item) => item.slice(2)).find(([target, regExp]) => Array.isArray(target) ? !target.find((item) => regExp.test(item)) : !regExp.test(target))) continue;

				if(!pattern.message) pattern.message = '${workspaceName}\'s ${fileName} is open!';
				
				for(const [name, target] of Object.entries(targets)){
					pattern.message = pattern.message.replace('${' + name + '}', Array.isArray(target) ? target.join(', ') : target)
				}

				if(!pattern.messageType) pattern.messageType = 'information';
				const showMessage = vscode.window['show' + pattern.messageType.substring(0, 1).toUpperCase() + pattern.messageType.substring(1) + 'Message'];
				if(showMessage) showMessage(pattern.message || 'empty');
				else vscode.window.showErrorMessage(`settings.openWatcher.patterns[${i}].messageType = "${pattern.messageType}" is error.`);
				break;
			}
		}catch(e){
			vscode.window.showErrorMessage(e.constructor.name + ':' + e.message);
		}
		
	};

	proc(vscode.window.activeTextEditor);
	
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(proc));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

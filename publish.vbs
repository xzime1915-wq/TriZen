Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
script = dir & "\scripts\publish.py"

On Error Resume Next

sh.Run "pyw -3 """ & script & """", 1, False
If Err.Number = 0 Then WScript.Quit 0
Err.Clear

sh.Run "pythonw """ & script & """", 1, False
If Err.Number = 0 Then WScript.Quit 0

MsgBox "Python not found." & vbCrLf & vbCrLf & "Install Python 3 from python.org", vbCritical, "TRIZEN Publish"
WScript.Quit 1

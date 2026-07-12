import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

function CodeEditor({ code, setCode }) {

    function handleEditorWillMount(monaco){

        monaco.editor.defineTheme("runtime-theme",{

            base: "vs-dark",
            inherit: true,

            rules: [
                { token: "keyword", foreground: "C8B6FF", fontStyle: "bold" },
                { token: "string", foreground: "A8E6CF" },
                { token: "number", foreground: "FFD166" },
                { token: "comment", foreground: "7D8597", fontStyle: "italic" },
                { token: "type", foreground: "8EECF5" },
                { token: "identifier", foreground: "F8F8FF" }
            ],

            colors: {
    "editor.background": "#1A1733",

    "editor.foreground": "#F8F8FF",

    "editorCursor.foreground": "#C8B6FF",

    "editor.selectionBackground": "#5D4E99AA",

    "editor.lineHighlightBackground": "#252047",

    "editorLineNumber.foreground": "#6E6A99",

    "editorLineNumber.activeForeground": "#FFFFFF",

    "editorIndentGuide.background": "#38345E",

    "editorIndentGuide.activeBackground": "#C8B6FF",

    "editorBracketHighlight.foreground1": "#FFD166",
    "editorBracketHighlight.foreground2": "#72EFDD",
    "editorBracketHighlight.foreground3": "#FF8FA3",
    "editorBracketHighlight.foreground4": "#A0C4FF",
    "editorBracketHighlight.foreground5": "#C8B6FF",
    "editorBracketHighlight.foreground6": "#F4A261"
}
        });
    }

    return(
        <div className="editor-container">
            <Editor
                height="400px"
                language="cpp"
                value={code}
                beforeMount={handleEditorWillMount}
                theme="runtime-theme"
                onChange={(value) => setCode(value || "")}
                options={{
                    tabSize: 4,
                    insertSpaces: true,
                    detectIndentation: false,
                    formatOnPaste: true,
                    formatOnType: true
                }}
            />
        </div>
    );
}

export default CodeEditor;
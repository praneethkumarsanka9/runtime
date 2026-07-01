import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

function CodeEditor({ code, setCode }) {

    function handleEditorWillMount(monaco){

        monaco.editor.defineTheme("runtime-theme",{

            base: "vs-dark",
            inherit: true,

            rules: [
                { token: "keyword", foreground: "FFFFFF", fontStyle: "bold" },
                { token: "string", foreground: "F7F7F7" },
                { token: "number", foreground: "FFF4C2" },
                { token: "comment", foreground: "E0DBFF", fontStyle: "italic" },
                { token: "type", foreground: "FFFFFF" }
            ],

            colors: {

                "editor.background": "#9892e9",

                "editor.foreground": "#FFFFFF",

                "editorCursor.foreground": "#FFFFFF",

                "editor.selectionBackground": "#B8B2FF",

                "editor.lineHighlightBackground": "#A59CFF",

                "editorLineNumber.foreground": "#DCD6FF",

                "editorLineNumber.activeForeground": "#FFFFFF",

                "editorIndentGuide.background": "#B8B2FF",

                "editorIndentGuide.activeBackground": "#FFFFFF"
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
            />
        </div>
    );
}

export default CodeEditor;
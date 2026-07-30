export const level5 = {
  id: "level-5",
  title: "Level 5 – JSON",
  type: "theory",
  content: `
## Learning Objectives
By the end of this level, you will understand the syntax and structure of JSON, and why it has become the universal standard for sending and receiving data over the web.

## Prerequisites
- Level 4 (REST APIs)

## Concept Explanation
**JSON (JavaScript Object Notation)** is a lightweight text format used for storing and transporting data. Even though it has "JavaScript" in the name, it is completely language-independent. Python, Go, Java, and PHP all have built-in ways to read and write JSON.

JSON data is written as **key/value pairs** (similar to a dictionary). It supports basic data types:
- Strings (\`"hello"\`)
- Numbers (\`42\`)
- Booleans (\`true\` / \`false\`)
- Null (\`null\`)
- Arrays (\`[1, 2, 3]\`)
- Nested Objects (\`{"key": "value"}\`)

## Real-World Analogy
Think of JSON as a standardized shipping container. Before standard shipping containers existed, loading cargo onto a ship was a nightmare because boxes came in a million different shapes and sizes. JSON is the standard shipping container for data. Because every programming language agrees on its exact dimensions (syntax), it is incredibly easy to pack data in Python, ship it over HTTP, and unpack it perfectly in JavaScript.

## Visual Diagram
\`\`\`mermaid
graph LR
    A[Python App] -- serializes dict to JSON --> B(HTTP POST)
    B -- JSON Payload --> C[Node.js App]
    C -- parses JSON to JS Object --> D[Database]
\`\`\`

## Technical Deep Dive: JSON vs XML
Before JSON, the standard format for web data was XML (eXtensible Markup Language). XML uses opening and closing tags (like HTML). 

**XML Example:**
\`\`\`xml
<user>
  <name>Jem</name>
  <age>26</age>
</user>
\`\`\`

**JSON Example:**
\`\`\`json
{
  "user": {
    "name": "Jem",
    "age": 26
  }
}
\`\`\`

JSON won the war because it requires significantly fewer characters (less bandwidth) and directly maps to the object/dictionary data structures used natively by modern programming languages, avoiding complex parsing algorithms.

## Code Example
When sending data to an API, you must **Stringify** (serialize) your code object into a JSON text string. When receiving data, you must **Parse** (deserialize) the text string back into a usable object.

\`\`\`javascript
// 1. You have a native JavaScript object
const myData = { name: "Jem", role: "admin" };

// 2. Stringify it to send over HTTP
const jsonString = JSON.stringify(myData);
console.log(jsonString); // '{"name":"Jem","role":"admin"}'

// 3. Parse an incoming JSON string back into an object
const incomingText = '{"status":"success"}';
const parsedData = JSON.parse(incomingText);
console.log(parsedData.status); // "success"
\`\`\`

## Common Mistakes
- **Trailing Commas:** JSON is notoriously strict. A trailing comma at the end of an array or object (\`{"name": "Jem",}\`) will completely break the parser.
- **Single Quotes:** JSON keys and string values *must* be wrapped in double quotes (\`"\`). Single quotes (\`'\`) are invalid.

## Troubleshooting
- **\`SyntaxError: Unexpected token ' in JSON at position 1\`**: You tried to parse a string that isn't valid JSON. You likely used single quotes instead of double quotes, or forgot to wrap your keys in quotes.

## Best Practices
- **Validate your JSON:** When writing raw JSON (e.g., for a webhook payload configuration), always run it through a tool like [JSONLint](https://jsonlint.com/) to catch missing brackets or extra commas.

## Hands-On Lab
*No interactive lab here, but try opening your browser's Developer Tools (F12), go to the Console, and type \`JSON.parse('{"hello": "world"}')\` to see the engine parse the string into an object!*

## Key Takeaways
1. JSON is a text format used to transport data.
2. It is lightweight, language-independent, and easy for humans to read.
3. Keys and string values must always use double quotes.

## What's Next
Now that we know how to package our data neatly, how do we ensure only authorized users are allowed to access our APIs? Next up: **API Authentication**.
`,
  quiz: {
    question: "Which of the following is a completely valid JSON string?",
    options: [
      "{'name': 'Jem'}",
      "{name: \"Jem\"}",
      "{\"name\": \"Jem\",}",
      "{\"name\": \"Jem\"}"
    ],
    correctAnswerIndex: 3,
    explanation: "JSON requires all keys and string values to be wrapped in double quotes, and it strictly forbids trailing commas."
  }
};

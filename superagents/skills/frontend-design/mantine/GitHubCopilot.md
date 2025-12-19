# Mantine: GitHub Copilot

While Copilot doesn't directly support external documentation, you can:

1. Include relevant documentation snippets in your comments
2. Reference component names and props accurately for better suggestions

## Example Prompts

Here are some example prompts you can use with AI tools:

* "Using Mantine v8, how do I create a dark mode toggle?"
* "Show me how to use the AppShell component with a collapsible navbar"
* "How can I customize the theme colors in MantineProvider?"
* "Create a form with validation using Mantine's form hooks"
* "How to align input with a button in a flex container?"

## Documentation Generation

The LLM documentation is automatically generated from our source files using a compilation script. It includes:

* Component documentation from MDX files
* Props tables and types
* Code examples and demos
* Styles API documentation
* FAQ content from help.mantine.dev

To ensure you have the latest documentation, we regenerate the llms.txt file with each release. The file follows the [LLMs.txt](https://llmstxt.org/) standard for better compatibility with AI tools.

## Contributing

If you find any issues with the LLM documentation or have suggestions for improvement, please [open an issue](https://github.com/mantinedev/mantine/issues) on our GitHub repository.


--------------------------------------------------------------------------------
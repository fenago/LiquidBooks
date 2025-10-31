# Sample Jupyter Book Chapter

This file shows examples of all the features supported by LiquidBooks.

## Text Formatting

You can use **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code`.

## Lists

### Unordered Lists
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered Lists
1. First step
2. Second step
3. Third step

### Task Lists
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

## Code Blocks

### Python
\`\`\`python
def fibonacci(n):
    """Generate Fibonacci sequence"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 Fibonacci numbers
fib_sequence = [fibonacci(i) for i in range(10)]
print(f"Fibonacci sequence: {fib_sequence}")
\`\`\`

### JavaScript
\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};

greet('World');
\`\`\`

### SQL
\`\`\`sql
SELECT users.name, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.name
HAVING order_count > 5
ORDER BY order_count DESC;
\`\`\`

## Math Equations

### Inline Math

The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

Einstein's famous equation: $E = mc^2$

### Block Math

$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &= \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} &= 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &= \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} &= 0
\\end{aligned}
$$

### Matrix

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}
$$

## Admonitions

:::{note}
This is a note admonition. Use it for helpful information!
:::

:::{warning}
This is a warning. Be careful!
:::

:::{tip}
Pro tip: Use keyboard shortcuts to speed up your workflow!
:::

:::{important}
This information is crucial for understanding the concept.
:::

:::{caution}
Proceed with caution when modifying production code.
:::

:::{danger}
Do NOT run this command on a production database!
:::

:::{seealso}
Check out the [official documentation](https://jupyterbook.org) for more details.
:::

## Tables

### Simple Table

| Name | Age | City |
|------|-----|------|
| Alice | 25 | New York |
| Bob | 30 | San Francisco |
| Charlie | 35 | Boston |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Data 1 | Data 2 | Data 3 |
| More data | Centered | Right |

## Links and Images

### Links
- [External link](https://jupyterbook.org)
- [Link with title](https://example.com "Example Website")

### Images
![Placeholder Image](https://via.placeholder.com/400x200?text=Sample+Image)

## Blockquotes

> This is a blockquote. It can be used for citations or important quotes.
>
> It can span multiple paragraphs.
>
> — Author Name

## Horizontal Rules

---

## Footnotes

Here's a sentence with a footnote.[^1]

[^1]: This is the footnote text.

## Definition Lists

Term 1
: Definition of term 1

Term 2
: Definition of term 2
: Another definition for term 2

## Nested Structures

:::{note}
You can nest admonitions inside other elements:

\`\`\`python
def example():
    return "Code inside admonition"
\`\`\`

And even math: $f(x) = x^2$
:::

## Tabs (using sphinx-design)

````{tab-set}
```{tab-item} Python
\`\`\`python
print("Hello from Python!")
\`\`\`
```

```{tab-item} JavaScript
\`\`\`javascript
console.log("Hello from JavaScript!");
\`\`\`
```

```{tab-item} Ruby
\`\`\`ruby
puts "Hello from Ruby!"
\`\`\`
```
````

## Dropdowns (using sphinx-design)

```{dropdown} Click to expand
This content is hidden by default and revealed when clicked!

You can include:
- Lists
- Code blocks
- Math
- Anything else!
```

## Grids (using sphinx-design)

````{grid} 2
```{grid-item}
**Column 1**

Content for the first column.
```

```{grid-item}
**Column 2**

Content for the second column.
```
````

## Cards (using sphinx-design)

```{card} Card Title
Card body with some content.
:::
{card-footer}
Card footer
:::
```

## Mermaid Diagrams (if enabled)

\`\`\`{mermaid}
graph LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

## Code with Line Numbers

\`\`\`{code-block} python
:linenos:
:emphasize-lines: 2,3

def example_function():
    # These lines are highlighted
    x = 10
    y = 20
    return x + y

result = example_function()
print(result)
\`\`\`

## HTML (if needed)

<div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px;">
  <h3>Custom HTML Block</h3>
  <p>You can include raw HTML when needed.</p>
</div>

## Emojis

You can use emojis in your content! 🚀 📚 ✨ 💻 🎉

## Summary

This sample demonstrates:
- ✅ Text formatting (bold, italic, code)
- ✅ Lists (ordered, unordered, task lists)
- ✅ Code blocks (Python, JavaScript, SQL, etc.)
- ✅ Math equations (inline and block)
- ✅ Admonitions (note, warning, tip, etc.)
- ✅ Tables (simple and aligned)
- ✅ Links and images
- ✅ Blockquotes
- ✅ Footnotes
- ✅ And much more!

Happy writing! 📝

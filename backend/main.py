from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import subprocess
import tempfile
import shutil
from pathlib import Path
import os
import traceback
import json
from github import Github
from dotenv import load_dotenv
from openai import OpenAI
from book_types import get_book_type, get_all_book_types
from prompt_builder import (
    build_outline_system_prompt,
    build_outline_user_prompt,
    build_chapter_system_prompt,
    build_chapter_user_prompt,
    estimate_tokens,
    calculate_cost
)

load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Import AI provider wrapper
from ai_provider import get_ai_provider

app = FastAPI(title="LiquidBooks API")

# CORS middleware - allow local development and production domains
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
]

# Add production frontend URLs from environment variable (comma-separated)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    # Support multiple URLs separated by commas
    urls = [url.strip() for url in frontend_url.split(",")]
    allowed_origins.extend(urls)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Chapter(BaseModel):
    id: str
    title: str
    content: str
    order: int


class Book(BaseModel):
    id: str
    title: str
    author: str
    description: str
    chapters: List[Chapter]


class BuildRequest(BaseModel):
    book: Book
    features: Optional[List[str]] = None
    github_username: Optional[str] = None
    github_token: Optional[str] = None
    repo_name: Optional[str] = None


class BuildResponse(BaseModel):
    success: bool
    message: str
    url: Optional[str] = None
    build_dir: Optional[str] = None


class AIBookRequest(BaseModel):
    topic: str
    system_prompt: Optional[str] = None
    num_chapters: Optional[int] = 5


class AIChapterRequest(BaseModel):
    book_title: str
    book_description: str
    chapter_title: str
    chapter_description: Optional[str] = None
    system_prompt: Optional[str] = None
    include_code: Optional[bool] = True
    include_math: Optional[bool] = True
    include_admonitions: Optional[bool] = True
    include_quiz: Optional[bool] = False
    include_images: Optional[bool] = False


class AIResponse(BaseModel):
    success: bool
    content: Optional[str] = None
    error: Optional[str] = None


# New models for Phase 1
class GenerateOutlineRequest(BaseModel):
    topic: str
    book_type: str
    tone: str
    target_audience: str
    num_chapters: Optional[int] = None
    pages_per_chapter: Optional[int] = None
    requirements: Optional[str] = None
    custom_system_prompt: Optional[str] = None
    custom_user_prompt: Optional[str] = None
    return_prompts: bool = False


class PreviewPromptRequest(BaseModel):
    topic: str
    book_type: str
    tone: str
    target_audience: str
    num_chapters: Optional[int] = None
    requirements: Optional[str] = None


class GenerateChapterRequest(BaseModel):
    book_context: Dict[str, Any]
    chapter_context: Dict[str, Any]
    features: List[str]
    additional_instructions: Optional[str] = None
    custom_system_prompt: Optional[str] = None
    custom_user_prompt: Optional[str] = None


class AvatarGenerationRequest(BaseModel):
    """Request to generate customer avatars based on questionnaire responses"""
    questionnaire_responses: Optional[Dict[str, Any]] = None  # User's answers to all sections (old format)
    prompt: Optional[str] = None  # New token-based prompt format
    awareness_stage: str  # Which awareness stage to generate avatar for ('all' for all 5 stages)
    system_prompt: Optional[str] = None  # User can override default prompt


class DiaryGenerationRequest(BaseModel):
    """Request to generate diary entries for an avatar"""
    avatar_profile: Dict[str, Any]  # The generated avatar data
    diary_type: str  # 'before', 'during', 'after'
    book_context: Optional[Dict[str, Any]] = None  # Context about the book
    system_prompt: Optional[str] = None  # User can override default prompt


def sanitize_filename(title: str) -> str:
    """Convert title to safe filename"""
    return title.lower().replace(" ", "-").replace("/", "-").replace("'", "")


def generate_config_yml(book: Book, book_dir: Path, features: Optional[List[str]] = None):
    """
    Generate Jupyter Book _config.yml with dynamic extensions based on features

    Args:
        book: Book object with metadata
        book_dir: Path to book directory
        features: List of feature IDs to enable
    """
    if features is None:
        features = []

    # Map features to required Sphinx extensions
    # Features with empty lists are built into MyST/Sphinx/Jupyter Book
    feature_extensions_map = {
        # Basic Content Features
        'admonitions': [],  # Built into MyST
        'dropdowns': ['sphinx_togglebutton'],
        'admonition_dropdowns': ['sphinx_togglebutton'],
        'definition_lists': [],  # MyST extension: deflist
        'blockquotes': [],  # Built into MyST
        'epigraphs': [],  # Built into Sphinx
        'glossary': [],  # Built into Sphinx
        'footnotes': [],  # Built into MyST
        'sidebar': [],  # Built into Sphinx
        'margin_notes': [],  # Built into Sphinx

        # Code Features
        'code_blocks': ['sphinx_copybutton'],
        'code_execution': [],  # Built into Jupyter Book
        'code_cell_tags': [],  # Built into MyST-NB
        'output_gluing': [],  # Built into MyST-NB
        'thebe': ['sphinx_thebe'],
        'binder_buttons': [],  # Config-based
        'scroll_output': [],  # CSS-based
        'line_numbers': [],  # Built into Sphinx

        # Math Features
        'math_equations': [],  # MyST extension: dollarmath
        'amsmath': [],  # MyST extension: amsmath
        'math_labels': [],  # Built into MyST
        'theorems': ['sphinx_proof'],
        'proofs': ['sphinx_proof'],
        'algorithms': ['sphinx_proof'],
        'lemmas': ['sphinx_proof'],
        'corollaries': ['sphinx_proof'],
        'definitions': ['sphinx_proof'],

        # Sphinx Design Components
        'grids': ['sphinx_design'],
        'cards': ['sphinx_design'],
        'tabs': ['sphinx_design'],
        'badges': ['sphinx_design'],
        'buttons': ['sphinx_design'],
        'icons': ['sphinx_design'],
        'grid_cards': ['sphinx_design'],
        'custom_divs': [],  # Built into MyST

        # Visual & Diagrams
        'figures': [],  # Built into MyST
        'images': [],  # Built into MyST
        'html_images': [],  # MyST extension: html_image
        'mermaid_diagrams': ['sphinxcontrib.mermaid'],
        'tables': [],  # Built into MyST

        # Interactive Features
        'quizzes': ['jupyterquiz'],
        'exercise': ['sphinx_exercise'],
        'interactive_plots': [],  # Via code execution
        'widgets': [],  # Via Jupyter

        # MyST Extensions (handled separately in myst_enable_extensions)
        'colon_fence': [],  # MyST extension
        'substitutions': [],  # MyST extension: substitution
        'smartquotes': [],  # MyST extension
        'linkify': [],  # MyST extension
        'replacements': [],  # MyST extension
        'tasklists': [],  # MyST extension: tasklist
        'html_admonition': [],  # MyST extension
        'attrs_inline': [],  # MyST extension
        'attrs_block': [],  # MyST extension

        # References & Citations
        'cross_references': [],  # Built into Sphinx
        'target_headers': [],  # Built into MyST
        'citations': ['sphinxcontrib.bibtex'],
        'numbered_references': [],  # Built into Sphinx

        # Advanced Features
        'line_comments': [],  # Built into MyST
        'block_breaks': [],  # Built into MyST
        'html_blocks': [],  # Built into MyST
        'reference_style_links': [],  # Built into MyST
        'thematic_breaks': [],  # Built into MyST
    }

    # Map MyST feature IDs to MyST extension names
    myst_feature_map = {
        'math_equations': 'dollarmath',
        'amsmath': 'amsmath',
        'colon_fence': 'colon_fence',
        'definition_lists': 'deflist',
        'html_images': 'html_image',
        'linkify': 'linkify',
        'replacements': 'replacements',
        'smartquotes': 'smartquotes',
        'substitutions': 'substitution',
        'tasklists': 'tasklist',
        'html_admonition': 'html_admonition',
        'attrs_inline': 'attrs_inline',
        'attrs_block': 'attrs_block',
    }

    # Collect unique Sphinx extensions based on enabled features
    extensions = set()
    for feature in features:
        if feature in feature_extensions_map:
            extensions.update(feature_extensions_map[feature])

    # Always include these core extensions
    extensions.add('sphinx_copybutton')  # Copy button for code blocks
    extensions.add('sphinx_togglebutton')  # Toggle buttons for content

    # Remove empty strings (from features with no Sphinx extension)
    extensions.discard('')

    # Build extensions list string
    extensions_yaml = ""
    if extensions:
        extensions_yaml = "\n    - " + "\n    - ".join(sorted(extensions))

    # Collect MyST extensions based on enabled features
    myst_extensions = set()
    for feature in features:
        if feature in myst_feature_map:
            myst_extensions.add(myst_feature_map[feature])

    # Build MyST extensions YAML
    myst_yaml = ""
    if myst_extensions:
        myst_yaml = "\n      - " + "\n      - ".join(sorted(myst_extensions))

    # Get copyright year from publishing info or use current year
    from datetime import datetime
    copyright_year = book.get('publishingInfo', {}).get('yearOfPublication') if isinstance(book, dict) else getattr(book, 'publishingInfo', {}).get('yearOfPublication') if hasattr(book, 'publishingInfo') and book.publishingInfo else None
    if not copyright_year:
        copyright_year = str(datetime.now().year)

    # Get author name to display (pen name if available, otherwise author)
    author_display = book.author
    if hasattr(book, 'publishingInfo') and book.publishingInfo:
        publishing_info = book.publishingInfo if isinstance(book.publishingInfo, dict) else book.publishingInfo.__dict__
        if publishing_info.get('showAuthorName') and publishing_info.get('penName'):
            author_display = publishing_info.get('penName')

    config_content = f"""# Book settings
title: "{book.title}"
author: "{author_display}"
copyright: "{copyright_year}"
logo: ""

# Force re-execution of notebooks on each build
execute:
  execute_notebooks: auto
  timeout: 100

# Define the name of the latex output file for PDF builds
latex:
  latex_documents:
    targetname: book.tex

# Add a bibtex file so that we can create citations
bibtex_bibfiles:
  - references.bib

# Information about where the book exists on the web
repository:
  url: https://github.com/yourusername/yourbook
  path_to_book: ""
  branch: main

# Add GitHub buttons to your book
html:
  use_issues_button: true
  use_repository_button: true
  use_edit_page_button: true
  extra_footer: |
    <div>
      Built with <a href="https://jupyterbook.org">Jupyter Book</a>
    </div>

# Launch buttons configuration
launch_buttons:
  notebook_interface: "classic"
  binderhub_url: "https://mybinder.org"
  colab_url: "https://colab.research.google.com"
  thebe: true

# Parse and render settings
parse:
  myst_enable_extensions:{myst_yaml}
  myst_url_schemes: [mailto, http, https]

# Sphinx configuration
sphinx:
  extra_extensions:{extensions_yaml}
  config:
    html_theme: sphinx_book_theme
    html_theme_options:
      repository_url: https://github.com/yourusername/yourbook
      use_repository_button: true
      use_issues_button: true
      use_edit_page_button: true
      home_page_in_toc: true
      show_navbar_depth: 2
      show_toc_level: 2
    html_show_copyright: true
    html_show_sphinx: false
    mathjax_path: https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
"""

    (book_dir / "_config.yml").write_text(config_content)


def generate_copyright_page(book: Book) -> str:
    """Generate copyright page content"""
    content = "# Copyright\n\n"

    # Get publishing info
    publishing_info = {}
    legal_clauses = {}

    if hasattr(book, 'publishingInfo') and book.publishingInfo:
        publishing_info = book.publishingInfo if isinstance(book.publishingInfo, dict) else book.publishingInfo.__dict__

    if hasattr(book, 'legalClauses') and book.legalClauses:
        legal_clauses = book.legalClauses if isinstance(book.legalClauses, dict) else book.legalClauses.__dict__

    # Title and author
    author_name = publishing_info.get('penName', book.author)
    year = publishing_info.get('yearOfPublication', str(__import__('datetime').datetime.now().year))

    content += f"**{book.title}**\n\n"

    if publishing_info.get('showAuthorName', True):
        content += f"by {author_name}\n\n"

    # Edition and publication info
    if publishing_info.get('edition'):
        content += f"{publishing_info.get('edition')}\n\n"

    # Copyright statement
    content += f"Copyright © {year}"
    if publishing_info.get('showAuthorName', True):
        content += f" by {author_name}"
    content += "\n\n"

    # Legal clauses
    if legal_clauses.get('allRightsReserved', True):
        content += "All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.\n\n"

    if legal_clauses.get('fiction'):
        content += "This is a work of fiction. Names, characters, places, and incidents either are the product of the author's imagination or are used fictitiously. Any resemblance to actual persons, living or dead, events, or locales is entirely coincidental.\n\n"

    if legal_clauses.get('moralRights'):
        content += f"The moral right of {author_name} to be identified as the author of this work has been asserted in accordance with applicable copyright laws.\n\n"

    if legal_clauses.get('externalContent'):
        content += "External content and quotations are used under fair use provisions or with permission. All trademarks mentioned in this book are the property of their respective owners.\n\n"

    if legal_clauses.get('designations'):
        content += "Designations used by companies to distinguish their products are often claimed as trademarks. All brand names and product names used in this book are trade names, service marks, trademarks, or registered trademarks of their respective owners.\n\n"

    # Publisher info
    if publishing_info.get('publisherName'):
        content += f"Published by {publishing_info.get('publisherName')}\n\n"

    # ISBNs
    isbns = publishing_info.get('isbns', {})
    if any(isbns.values() if isinstance(isbns, dict) else []):
        content += "**ISBN Information:**\n\n"
        if isinstance(isbns, dict):
            if isbns.get('epub'):
                content += f"- EPUB: {isbns.get('epub')}\n"
            if isbns.get('kindle'):
                content += f"- Kindle: {isbns.get('kindle')}\n"
            if isbns.get('paperback'):
                content += f"- Paperback: {isbns.get('paperback')}\n"
            if isbns.get('hardcover'):
                content += f"- Hardcover: {isbns.get('hardcover')}\n"
            if isbns.get('pdf'):
                content += f"- PDF: {isbns.get('pdf')}\n"
        content += "\n"

    # Collaborators
    collaborators = publishing_info.get('collaborators', [])
    if collaborators:
        content += "**Credits:**\n\n"
        for collab in collaborators:
            if isinstance(collab, dict):
                content += f"- {collab.get('role', 'Contributor')}: {collab.get('name', 'Unknown')}\n"
        content += "\n"

    return content


def generate_front_matter_pages(book: Book) -> dict:
    """Generate front matter pages (epigraph, foreword, dedication, preface, acknowledgements)"""
    pages = {}

    publishing_info = {}
    if hasattr(book, 'publishingInfo') and book.publishingInfo:
        publishing_info = book.publishingInfo if isinstance(book.publishingInfo, dict) else book.publishingInfo.__dict__

    # Epigraph
    if publishing_info.get('epigraph'):
        pages['epigraph'] = f"# Epigraph\n\n{publishing_info.get('epigraph')}\n"

    # Foreword
    if publishing_info.get('foreword'):
        pages['foreword'] = f"# Foreword\n\n{publishing_info.get('foreword')}\n"

    # Dedication
    if publishing_info.get('dedication'):
        pages['dedication'] = f"# Dedication\n\n{publishing_info.get('dedication')}\n"

    # Preface
    if publishing_info.get('preface'):
        pages['preface'] = f"# Preface\n\n{publishing_info.get('preface')}\n"

    # Acknowledgements
    if publishing_info.get('acknowledgements'):
        pages['acknowledgements'] = f"# Acknowledgements\n\n{publishing_info.get('acknowledgements')}\n"

    return pages


def generate_back_matter_pages(book: Book) -> dict:
    """Generate back matter pages (about the author, also by the author)"""
    pages = {}

    publishing_info = {}
    if hasattr(book, 'publishingInfo') and book.publishingInfo:
        publishing_info = book.publishingInfo if isinstance(book.publishingInfo, dict) else book.publishingInfo.__dict__

    # About the Author
    if publishing_info.get('aboutTheAuthor'):
        pages['about_the_author'] = f"# About the Author\n\n{publishing_info.get('aboutTheAuthor')}\n"

    # Also by the Author
    if publishing_info.get('alsoByTheAuthor'):
        pages['also_by_the_author'] = f"# Also by the Author\n\n{publishing_info.get('alsoByTheAuthor')}\n"

    return pages


def generate_toc_yml(book: Book, book_dir: Path):
    """Generate Jupyter Book _toc.yml with front matter, chapters, and back matter"""
    sorted_chapters = sorted(book.chapters, key=lambda x: x.order)

    toc_content = "format: jb-book\n"
    toc_content += "root: intro\n"
    toc_content += "chapters:\n"

    # Add copyright page if publishing info exists
    publishing_info = {}
    if hasattr(book, 'publishingInfo') and book.publishingInfo:
        publishing_info = book.publishingInfo if isinstance(book.publishingInfo, dict) else book.publishingInfo.__dict__

    # Add copyright page
    toc_content += "  - file: copyright\n"

    # Add front matter pages (epigraph, foreword, dedication, preface, acknowledgements)
    if publishing_info.get('epigraph'):
        toc_content += "  - file: epigraph\n"
    if publishing_info.get('foreword'):
        toc_content += "  - file: foreword\n"
    if publishing_info.get('dedication'):
        toc_content += "  - file: dedication\n"
    if publishing_info.get('preface'):
        toc_content += "  - file: preface\n"
    if publishing_info.get('acknowledgements'):
        toc_content += "  - file: acknowledgements\n"

    # Add main chapters
    for i, chapter in enumerate(sorted_chapters):
        if i == 0:
            continue  # Skip first chapter as it's the root (intro)
        filename = sanitize_filename(chapter.title)
        toc_content += f"  - file: {filename}\n"

    # Add back matter pages (about the author, also by the author)
    if publishing_info.get('aboutTheAuthor'):
        toc_content += "  - file: about_the_author\n"
    if publishing_info.get('alsoByTheAuthor'):
        toc_content += "  - file: also_by_the_author\n"

    (book_dir / "_toc.yml").write_text(toc_content)


def write_chapters(book: Book, book_dir: Path):
    """Write chapter markdown files"""
    sorted_chapters = sorted(book.chapters, key=lambda x: x.order)

    for i, chapter in enumerate(sorted_chapters):
        if i == 0:
            # First chapter is intro
            filepath = book_dir / "intro.md"
        else:
            filename = sanitize_filename(chapter.title)
            filepath = book_dir / f"{filename}.md"

        filepath.write_text(chapter.content)


def build_jupyter_book(book_dir: Path) -> dict:
    """Run jupyter-book build command"""
    try:
        result = subprocess.run(
            ["jupyter-book", "build", str(book_dir), "--all"],
            capture_output=True,
            text=True,
            timeout=300,
        )

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Build timeout after 5 minutes",
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }


def generate_readme(book: Book, username: str, repo_name: str) -> str:
    """Generate README.md content for the deployed book"""
    gh_pages_url = f"https://{username}.github.io/{repo_name}"

    content = f"# {book.title}\n\n"

    if book.author:
        content += f"**Author:** {book.author}\n\n"

    if book.description:
        content += f"{book.description}\n\n"

    content += f"## View the Book\n\n"
    content += f"📖 **[Read the book online]({gh_pages_url})**\n\n"

    content += f"This interactive book was built using [Jupyter Book](https://jupyterbook.org/) and [LiquidBooks](https://github.com/yourusername/liquidbooks).\n\n"

    # Add publishing info if available
    publishing_info = {}
    if hasattr(book, 'publishingInfo') and book.publishingInfo:
        publishing_info = book.publishingInfo if isinstance(book.publishingInfo, dict) else book.publishingInfo.__dict__

    if publishing_info.get('yearOfPublication'):
        content += f"**Published:** {publishing_info.get('yearOfPublication')}\n\n"

    if publishing_info.get('edition'):
        content += f"**Edition:** {publishing_info.get('edition')}\n\n"

    # Add chapter count
    if book.chapters:
        content += f"**Chapters:** {len(book.chapters)}\n\n"

    content += "---\n\n"
    content += f"*Generated with LiquidBooks - AI-powered book creation platform*\n"

    return content


def deploy_to_github(
    book_dir: Path,
    username: str,
    token: str,
    repo_name: str,
    book: Book = None,
) -> dict:
    """Deploy built book to GitHub Pages"""
    import subprocess
    import tempfile

    try:
        print(f"[GitHub Deploy] Starting deployment for {username}/{repo_name}")
        g = Github(token)
        user = g.get_user()
        print(f"[GitHub Deploy] Authenticated as {user.login}")

        # Create or get repository
        try:
            repo = user.get_repo(repo_name)
            print(f"[GitHub Deploy] Found existing repository: {repo.html_url}")
        except:
            print(f"[GitHub Deploy] Creating new repository: {repo_name}")
            repo = user.create_repo(
                repo_name,
                description="Interactive book built with Jupyter Book",
                auto_init=True,
            )
            print(f"[GitHub Deploy] Repository created: {repo.html_url}")

        # Get the built HTML files
        html_dir = book_dir / "_build" / "html"

        if not html_dir.exists():
            print(f"[GitHub Deploy] ERROR: Build output not found at {html_dir}")
            return {
                "success": False,
                "error": "Build output not found",
            }

        print(f"[GitHub Deploy] Found build output at {html_dir}")

        # Use git commands to push files to gh-pages branch
        with tempfile.TemporaryDirectory() as temp_git_dir:
            temp_git_path = Path(temp_git_dir) / "repo"

            # Clone the repository
            print(f"[GitHub Deploy] Cloning repository to {temp_git_path}")
            repo_url = f"https://{token}@github.com/{username}/{repo_name}.git"

            # Wait a moment for newly created repo to be ready
            import time
            if repo.created_at.timestamp() > (time.time() - 10):
                print(f"[GitHub Deploy] Repository just created, waiting 2 seconds...")
                time.sleep(2)

            result = subprocess.run(
                ["git", "clone", repo_url, str(temp_git_path)],
                check=True,
                capture_output=True,
                text=True
            )
            print(f"[GitHub Deploy] Clone completed")

            # Create or checkout gh-pages branch
            try:
                print(f"[GitHub Deploy] Checking out gh-pages branch")
                subprocess.run(
                    ["git", "checkout", "gh-pages"],
                    cwd=temp_git_path,
                    check=True,
                    capture_output=True,
                    text=True
                )
                print(f"[GitHub Deploy] Checked out existing gh-pages branch")
            except subprocess.CalledProcessError:
                # Create orphan gh-pages branch if it doesn't exist
                print(f"[GitHub Deploy] Creating new orphan gh-pages branch")
                subprocess.run(
                    ["git", "checkout", "--orphan", "gh-pages"],
                    cwd=temp_git_path,
                    check=True,
                    capture_output=True,
                    text=True
                )
                # Remove all files from the new orphan branch
                subprocess.run(
                    ["git", "rm", "-rf", "."],
                    cwd=temp_git_path,
                    capture_output=True,
                    text=True
                )
                print(f"[GitHub Deploy] Orphan branch created")

            # Remove all existing files in the repo (except .git)
            print(f"[GitHub Deploy] Clearing existing files")
            for item in temp_git_path.iterdir():
                if item.name != ".git":
                    if item.is_dir():
                        shutil.rmtree(item)
                    else:
                        item.unlink()

            # Copy all files from html_dir to temp_git_path
            print(f"[GitHub Deploy] Copying build files to repository")
            file_count = 0
            for item in html_dir.iterdir():
                if item.is_dir():
                    shutil.copytree(item, temp_git_path / item.name)
                    file_count += sum(1 for _ in (temp_git_path / item.name).rglob('*'))
                else:
                    shutil.copy2(item, temp_git_path / item.name)
                    file_count += 1
            print(f"[GitHub Deploy] Copied {file_count} files")

            # Add .nojekyll file to prevent Jekyll processing
            (temp_git_path / ".nojekyll").touch()
            print(f"[GitHub Deploy] Added .nojekyll file")

            # Generate and add README.md if book object is provided
            if book:
                readme_content = generate_readme(book, username, repo_name)
                (temp_git_path / "README.md").write_text(readme_content)
                print(f"[GitHub Deploy] Added README.md with book information")

            # Configure git
            subprocess.run(
                ["git", "config", "user.email", "liquidbooks@example.com"],
                cwd=temp_git_path,
                check=True
            )
            subprocess.run(
                ["git", "config", "user.name", "LiquidBooks"],
                cwd=temp_git_path,
                check=True
            )

            # Add all files
            print(f"[GitHub Deploy] Staging files for commit")
            subprocess.run(
                ["git", "add", "."],
                cwd=temp_git_path,
                check=True
            )

            # Commit
            print(f"[GitHub Deploy] Creating commit")
            result = subprocess.run(
                ["git", "commit", "-m", "Deploy Jupyter Book to GitHub Pages"],
                cwd=temp_git_path,
                check=True,
                capture_output=True,
                text=True
            )
            print(f"[GitHub Deploy] Commit created")

            # Push to gh-pages branch
            print(f"[GitHub Deploy] Pushing to GitHub")
            result = subprocess.run(
                ["git", "push", "-f", "origin", "gh-pages"],
                cwd=temp_git_path,
                check=True,
                capture_output=True,
                text=True
            )
            print(f"[GitHub Deploy] Push completed successfully")

        # Enable GitHub Pages on gh-pages branch
        print(f"[GitHub Deploy] Enabling GitHub Pages")
        try:
            repo.enable_pages(branch="gh-pages")
            print(f"[GitHub Deploy] GitHub Pages enabled")
        except Exception as e:
            print(f"[GitHub Deploy] Pages already enabled or error: {e}")

        pages_url = f"https://{username}.github.io/{repo_name}/"
        print(f"[GitHub Deploy] Deployment complete! URL: {pages_url}")

        return {
            "success": True,
            "url": pages_url,
            "message": "Book deployed to GitHub Pages",
        }

    except subprocess.CalledProcessError as e:
        error_msg = f"Git command failed: {e.cmd}"
        if e.stdout:
            error_msg += f"\nStdout: {e.stdout}"
        if e.stderr:
            error_msg += f"\nStderr: {e.stderr}"
        print(f"[GitHub Deploy] ERROR: {error_msg}")
        return {
            "success": False,
            "error": error_msg,
        }
    except Exception as e:
        error_msg = f"{str(e)}"
        print(f"[GitHub Deploy] ERROR: {error_msg}")
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": error_msg,
        }


@app.get("/")
def read_root():
    return {"status": "LiquidBooks API is running"}


@app.get("/api/book-types")
async def get_book_types():
    """Get all available book types"""
    book_types = get_all_book_types()
    return {
        "success": True,
        "book_types": [
            {
                "id": bt.id,
                "name": bt.name,
                "category": bt.category,
                "description": bt.description,
                "available_tones": bt.available_tones,
                "typical_chapter_range": bt.typical_chapter_range,
                "recommended_features": bt.recommended_features
            }
            for bt in book_types
        ]
    }


@app.get("/api/ai/providers")
async def get_ai_providers():
    """Get list of available AI providers"""
    return {
        "success": True,
        "providers": [
            {
                "id": "openai",
                "name": "OpenAI",
                "description": "GPT-4 and GPT-3.5 models"
            },
            {
                "id": "anthropic",
                "name": "Anthropic",
                "description": "Claude 3 and 3.5 models"
            },
            {
                "id": "openrouter",
                "name": "OpenRouter",
                "description": "Access to multiple AI models"
            }
        ]
    }


@app.get("/api/ai/models")
async def get_ai_models(provider: str):
    """Get available models for a specific provider"""
    try:
        if provider == "openai":
            # Get OpenAI models
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                return {"success": False, "error": "OpenAI API key not configured"}

            client = OpenAI(api_key=api_key)
            models_response = client.models.list()

            # Filter for chat/text completion models (exclude embeddings, audio, whisper, tts, dall-e, etc.)
            excluded_keywords = [
                'embed', 'whisper', 'tts', 'dall-e', 'babbage', 'davinci-002',
                'audio', 'moderation', 'text-similarity', 'code-search'
            ]

            chat_models = [
                {
                    "id": model.id,
                    "name": model.id,
                    "created": model.created
                }
                for model in models_response.data
                if not any(keyword in model.id.lower() for keyword in excluded_keywords)
            ]

            # Sort by created date descending (newest first)
            chat_models.sort(key=lambda x: x.get("created", 0), reverse=True)

            return {
                "success": True,
                "models": chat_models
            }

        elif provider == "anthropic":
            # Fetch models directly from Anthropic API
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                return {"success": False, "error": "Anthropic API key not configured"}

            try:
                import httpx
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        "https://api.anthropic.com/v1/models",
                        headers={
                            "x-api-key": api_key,
                            "anthropic-version": "2023-06-01"
                        }
                    )

                    if response.status_code == 200:
                        data = response.json()
                        # Transform to our format
                        models = [
                            {
                                "id": model["id"],
                                "name": model.get("display_name", model["id"]),
                                "description": f"Created: {model.get('created_at', 'Unknown')}",
                                "context_length": 200000  # Default, can be refined per model
                            }
                            for model in data.get("data", [])
                        ]

                        return {
                            "success": True,
                            "models": models
                        }
                    else:
                        print(f"Anthropic API error: {response.status_code} - {response.text}")
            except Exception as e:
                print(f"Failed to fetch models from Anthropic API: {e}")

            # Fallback if API call fails
            return {"success": False, "error": "Failed to fetch models from Anthropic"}

        elif provider == "openrouter":
            # Fetch models from OpenRouter API
            api_key = os.getenv("OPENROUTER_API_KEY")
            if not api_key:
                return {"success": False, "error": "OpenRouter API key not configured"}

            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://openrouter.ai/api/v1/models",
                    headers={"Authorization": f"Bearer {api_key}"}
                )

                if response.status_code == 200:
                    data = response.json()
                    models = [
                        {
                            "id": model["id"],
                            "name": model.get("name", model["id"]),
                            "description": model.get("description", ""),
                            "context_length": model.get("context_length"),
                            "pricing": model.get("pricing")
                        }
                        for model in data.get("data", [])
                    ]

                    return {
                        "success": True,
                        "models": models
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Failed to fetch OpenRouter models: {response.status_code}"
                    }
        else:
            return {
                "success": False,
                "error": f"Unknown provider: {provider}"
            }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.post("/api/ai/preview-prompt")
async def preview_prompt(request: PreviewPromptRequest):
    """Preview the prompts that would be sent to AI for outline generation"""
    try:
        system_prompt = build_outline_system_prompt(
            book_type_id=request.book_type,
            tone=request.tone,
            target_audience=request.target_audience
        )

        user_prompt = build_outline_user_prompt(
            topic=request.topic,
            book_type_id=request.book_type,
            tone=request.tone,
            target_audience=request.target_audience,
            num_chapters=request.num_chapters,
            requirements=request.requirements
        )

        combined = system_prompt + "\n\n" + user_prompt
        tokens = estimate_tokens(combined)
        cost = calculate_cost(tokens)

        return {
            "success": True,
            "system_prompt": system_prompt,
            "user_prompt": user_prompt,
            "estimated_tokens": tokens,
            "estimated_cost": cost
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.post("/api/ai/generate-outline")
async def generate_outline(request: GenerateOutlineRequest):
    """Generate book skeleton/outline using AI"""

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file."
        )

    try:
        # Build prompts
        system_prompt = build_outline_system_prompt(
            book_type_id=request.book_type,
            tone=request.tone,
            target_audience=request.target_audience,
            custom_prompt=request.custom_system_prompt
        )

        user_prompt = build_outline_user_prompt(
            topic=request.topic,
            book_type_id=request.book_type,
            tone=request.tone,
            target_audience=request.target_audience,
            num_chapters=request.num_chapters,
            pages_per_chapter=request.pages_per_chapter,
            requirements=request.requirements,
            custom_prompt=request.custom_user_prompt
        )

        # If user just wants to see prompts
        if request.return_prompts:
            combined = system_prompt + "\n\n" + user_prompt
            tokens = estimate_tokens(combined)
            cost = calculate_cost(tokens)
            return {
                "success": True,
                "prompts": {
                    "system": system_prompt,
                    "user": user_prompt
                },
                "estimated_tokens": tokens,
                "estimated_cost": cost
            }

        # Call AI
        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=16000,  # Comprehensive outline with detailed chapters
            response_format={"type": "json_object"}
        )

        content = result["content"]

        return {
            "success": True,
            "outline": content  # This is JSON string, frontend will parse it
        }

    except Exception as e:
        error_msg = str(e)
        print(f"Outline generation error: {error_msg}")
        return {
            "success": False,
            "error": error_msg
        }


@app.post("/api/ai/generate-chapter-content")
async def generate_chapter_content(request: Dict[str, Any]):
    """Generate full content for a single chapter with comprehensive context"""

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file."
        )

    try:
        # Extract all context from comprehensive payload
        book_type = request.get('book_type', '')
        tone = request.get('tone', '')
        target_audience = request.get('target_audience', '')

        chapter_number = request.get('chapter_number', 1)
        chapter_title = request.get('chapter_title', '')
        chapter_description = request.get('chapter_description', '')
        learning_objectives = request.get('learning_objectives', [])
        suggested_components = request.get('suggested_components', [])
        estimated_words = request.get('estimated_words', 1500)

        chapter_template = request.get('chapter_template', 'standard')
        template_structure = request.get('template_structure', [])

        enabled_features = request.get('enabled_features', [])

        previous_chapter_title = request.get('previous_chapter_title')
        connection_to_previous = request.get('connection_to_previous')
        next_chapter_title = request.get('next_chapter_title')
        connection_to_next = request.get('connection_to_next')

        additional_instructions = request.get('additional_instructions')

        # Build comprehensive system prompt
        book_type_obj = get_book_type(book_type)
        base_system_prompt = book_type_obj.system_prompt if book_type_obj else ""

        system_prompt = f"""{base_system_prompt}

CHAPTER TEMPLATE: {chapter_template}
Follow this structure for the chapter:
{chr(10).join([f"- {item}" for item in template_structure])}

ENABLED JUPYTER BOOK FEATURES:
Use these features appropriately throughout the chapter:
{', '.join(enabled_features)}

CONTINUITY CONTEXT:
{f"Previous Chapter: {previous_chapter_title}" if previous_chapter_title else "This is the first chapter"}
{f"Connection from Previous: {connection_to_previous}" if connection_to_previous else ""}
{f"Next Chapter: {next_chapter_title}" if next_chapter_title else "This is the final chapter"}
{f"Connection to Next: {connection_to_next}" if connection_to_next else ""}

Write in {tone} tone for {target_audience} audience.

CRITICAL WORD COUNT REQUIREMENT:
You MUST write between {int(estimated_words * 0.9)} and {int(estimated_words * 1.1)} words.
Target: {estimated_words} words.
This is a strict requirement - do not significantly exceed or fall short of this range.
"""

        # Build comprehensive user prompt
        objectives_text = "\n".join([f"- {obj}" for obj in learning_objectives])
        components_text = ", ".join(suggested_components)
        additional_text = f"\n\nADDITIONAL REQUIREMENTS:\n{additional_instructions}" if additional_instructions else ""

        user_prompt = f"""Write the complete content for this chapter:

CHAPTER {chapter_number}: {chapter_title}

DESCRIPTION:
{chapter_description}

LEARNING OBJECTIVES:
{objectives_text}

SUGGESTED COMPONENTS TO INCLUDE:
{components_text}

Follow the {chapter_template} template structure.
Use MyST Markdown syntax with appropriate Jupyter Book features.
Make it engaging, clear, and valuable for the target audience.{additional_text}

IMPORTANT: Start the chapter with the heading formatted as:
# Chapter {chapter_number}: {chapter_title}

Return ONLY the chapter content in MyST Markdown format."""

        # Call AI
        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=8000  # Increased for comprehensive chapter content
        )

        content = result["content"]

        return {
            "success": True,
            "content": content,
            "estimated_tokens": result.get("tokens_used"),
            "chapter_number": chapter_number
        }

    except Exception as e:
        error_msg = str(e)
        print(f"Chapter generation error: {error_msg}")
        return {
            "success": False,
            "error": error_msg
        }


@app.post("/api/ai/generate-artifacts")
async def generate_artifacts(request: Dict[str, Any]):
    """
    Analyze book content and generate artifact prompts for images, videos, diagrams, and interactive elements

    This endpoint takes complete book context and returns structured artifact recommendations
    with ready-to-use generation prompts for external tools (nano banana, Sora 2, Veo 3, Mermaid.js)
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        # Import artifact types
        from artifact_types import (
            suggest_artifacts_for_content,
            get_artifact_by_id,
            ALL_ARTIFACTS
        )

        # Extract book context
        book_title = request.get('book_title', '')
        book_description = request.get('book_description', '')
        book_type = request.get('book_type', '')
        tone = request.get('tone', '')
        target_audience = request.get('target_audience', '')

        # Extract chapters data
        chapters = request.get('chapters', [])

        if not chapters:
            raise HTTPException(status_code=400, detail="No chapters provided for artifact generation")

        # Analyze each chapter for artifact opportunities
        all_artifacts = []

        for chapter in chapters:
            chapter_number = chapter.get('chapter_number', 1)
            chapter_title = chapter.get('title', '')
            chapter_description = chapter.get('description', '')
            chapter_content = chapter.get('content', '')
            learning_objectives = chapter.get('learning_objectives', [])

            # Get suggested artifact types for this chapter
            suggested_artifact_ids = suggest_artifacts_for_content(
                content_type=book_type,
                chapter_description=chapter_description + " " + chapter_content[:500],
                learning_objectives=learning_objectives
            )

            # Generate detailed artifact prompts using AI
            for artifact_id in suggested_artifact_ids:
                artifact_type = get_artifact_by_id(artifact_id)
                if not artifact_type:
                    continue

                # Build AI prompt to generate the actual artifact creation prompt
                system_prompt = f"""You are an expert at creating detailed, specific prompts for generating educational multimedia artifacts.

Your task is to analyze the provided chapter content and create a ready-to-use prompt for generating a {artifact_type.name} ({artifact_type.tool}).

The prompt you create should be:
- Specific and detailed
- Ready to be used directly with {artifact_type.tool}
- Tailored to the chapter's content and learning objectives
- Professional and educational in tone

Return ONLY the generated prompt text, nothing else."""

                user_prompt = f"""Create a detailed prompt for generating a {artifact_type.name} for this chapter:

Chapter {chapter_number}: {chapter_title}
Description: {chapter_description}
Learning Objectives: {', '.join(learning_objectives)}

Content Preview:
{chapter_content[:1000]}

Book Context:
- Title: {book_title}
- Type: {book_type}
- Tone: {tone}
- Audience: {target_audience}

Template to follow:
{artifact_type.prompt_template}

Generate the specific prompt now:"""

                # Call OpenAI to generate the artifact prompt
                ai = get_ai_provider()
                result = ai.chat_completion(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )

                generated_prompt = result["content"].strip()

                # Build artifact metadata
                artifact_data = {
                    "id": f"{artifact_id}_{chapter_number}_{len(all_artifacts)}",
                    "artifact_type_id": artifact_id,
                    "artifact_name": artifact_type.name,
                    "category": artifact_type.category.value,
                    "tool": artifact_type.tool,
                    "chapter_number": chapter_number,
                    "chapter_title": chapter_title,
                    "generated_prompt": generated_prompt,
                    "placement_guidelines": artifact_type.placement_guidelines,
                    "file_extension": artifact_type.file_extension,
                    "description": artifact_type.description
                }

                all_artifacts.append(artifact_data)

        # Group artifacts by category for better organization
        artifacts_by_category = {
            "image": [a for a in all_artifacts if a["category"] == "image"],
            "video": [a for a in all_artifacts if a["category"] == "video"],
            "diagram": [a for a in all_artifacts if a["category"] == "diagram"],
            "interactive": [a for a in all_artifacts if a["category"] == "interactive"]
        }

        return {
            "success": True,
            "total_artifacts": len(all_artifacts),
            "artifacts": all_artifacts,
            "artifacts_by_category": artifacts_by_category,
            "summary": {
                "images": len(artifacts_by_category["image"]),
                "videos": len(artifacts_by_category["video"]),
                "diagrams": len(artifacts_by_category["diagram"]),
                "interactive": len(artifacts_by_category["interactive"])
            }
        }

    except Exception as e:
        import traceback
        print(f"Error in generate_artifacts: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate artifacts: {str(e)}")


@app.post("/api/ai/enhance-book")
async def enhance_book(request: Dict[str, Any]):
    """
    Review and enhance complete book with cross-references, transitions, and polish

    This endpoint takes the complete book and enhances it with:
    - Cross-references between chapters
    - Smooth chapter transitions
    - Glossary term identification
    - Enhanced code examples
    - Strategic callouts and highlights
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        # Extract book context
        book_title = request.get('book_title', '')
        book_description = request.get('book_description', '')
        chapters = request.get('chapters', [])

        if not chapters:
            raise HTTPException(status_code=400, detail="No chapters provided for enhancement")

        enhancements = []

        # Enhance each chapter
        for i, chapter in enumerate(chapters):
            chapter_number = chapter.get('chapter_number', i + 1)
            chapter_title = chapter.get('title', '')
            chapter_content = chapter.get('content', '')

            # Build context about surrounding chapters
            prev_chapter = chapters[i - 1] if i > 0 else None
            next_chapter = chapters[i + 1] if i < len(chapters) - 1 else None

            system_prompt = """You are an expert book editor specializing in technical and educational content.

Your task is to review a chapter and suggest enhancements that will improve:
1. Cross-references to other chapters
2. Smooth transitions from previous chapter
3. Forward-looking hooks to next chapter
4. Glossary terms that should be defined
5. Code examples that could be enhanced
6. Strategic callouts (tips, warnings, notes)

Return your suggestions as a structured JSON object."""

            user_prompt = f"""Review and enhance this chapter from the book "{book_title}":

**Chapter {chapter_number}: {chapter_title}**

{chapter_content[:2000]}

**Context:**
- Previous Chapter: {prev_chapter['title'] if prev_chapter else 'N/A'}
- Next Chapter: {next_chapter['title'] if next_chapter else 'N/A'}
- Book Description: {book_description}

Provide enhancement suggestions in this JSON format:
{{
  "cross_references": [
    {{"reference_to": "Chapter X", "location": "Section name", "reason": "Why this reference helps"}}
  ],
  "chapter_transition": "Suggested opening paragraph that transitions from previous chapter",
  "forward_hook": "Suggested closing paragraph that creates anticipation for next chapter",
  "glossary_terms": [
    {{"term": "Term name", "definition": "Clear definition"}}
  ],
  "callouts": [
    {{"type": "tip|warning|note", "location": "Where to place", "content": "Callout content"}}
  ],
  "code_enhancements": [
    {{"location": "Code block identifier", "suggestion": "How to improve"}}
  ]
}}"""

            # Call AI for enhancements
            ai = get_ai_provider()
            result = ai.chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )

            enhancement_data = json.loads(result["content"])

            enhancements.append({
                "chapter_number": chapter_number,
                "chapter_title": chapter_title,
                "enhancements": enhancement_data
            })

        return {
            "success": True,
            "book_title": book_title,
            "total_chapters": len(chapters),
            "enhancements": enhancements
        }

    except Exception as e:
        import traceback
        print(f"Error in enhance_book: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to enhance book: {str(e)}")


@app.post("/api/build", response_model=BuildResponse)
async def build_book(request: BuildRequest):
    """Build a Jupyter Book and optionally deploy to GitHub Pages"""

    print(f"[Build API] Received build request")
    print(f"[Build API] GitHub username: {request.github_username}")
    print(f"[Build API] GitHub token provided: {'Yes' if request.github_token else 'No'}")
    print(f"[Build API] Repo name: {request.repo_name}")

    # Create temporary directory for book
    temp_dir = Path(tempfile.mkdtemp(prefix="liquidbook_"))

    try:
        # Generate Jupyter Book files
        generate_config_yml(request.book, temp_dir, request.features)
        generate_toc_yml(request.book, temp_dir)
        write_chapters(request.book, temp_dir)

        # Generate and write copyright page
        copyright_content = generate_copyright_page(request.book)
        (temp_dir / "copyright.md").write_text(copyright_content)

        # Generate and write front matter pages
        front_matter = generate_front_matter_pages(request.book)
        for filename, content in front_matter.items():
            (temp_dir / f"{filename}.md").write_text(content)

        # Generate and write back matter pages
        back_matter = generate_back_matter_pages(request.book)
        for filename, content in back_matter.items():
            (temp_dir / f"{filename}.md").write_text(content)

        # Create references.bib (empty for now)
        (temp_dir / "references.bib").write_text("")

        # Build the book
        build_result = build_jupyter_book(temp_dir)

        if not build_result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Build failed: {build_result.get('stderr', build_result.get('error'))}",
            )

        # If GitHub credentials provided, deploy
        deploy_url = None
        if request.github_username and request.github_token and request.repo_name:
            deploy_result = deploy_to_github(
                temp_dir,
                request.github_username,
                request.github_token,
                request.repo_name,
                request.book,
            )

            if deploy_result["success"]:
                deploy_url = deploy_result["url"]

        # For local testing, provide path to built HTML
        html_path = str(temp_dir / "_build" / "html" / "index.html")

        return BuildResponse(
            success=True,
            message="Book built successfully!",
            url=deploy_url or f"file://{html_path}",
            build_dir=str(temp_dir),
        )

    except Exception as e:
        # Clean up on error
        error_trace = traceback.format_exc()
        print(f"Error building book: {str(e)}")
        print(f"Traceback: {error_trace}")
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"{str(e)}\n\nTraceback: {error_trace}")


@app.post("/api/ai/download-book")
async def download_book(request: Dict[str, Any]):
    """Create a zip file of the built book for download"""
    import zipfile
    import io

    build_dir = request.get('build_dir')
    if not build_dir:
        raise HTTPException(status_code=400, detail="build_dir is required")

    build_path = Path(build_dir)
    if not build_path.exists():
        raise HTTPException(status_code=404, detail="Build directory not found")

    try:
        # Create zip file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Walk through the build directory
            for file_path in build_path.rglob('*'):
                if file_path.is_file():
                    # Get relative path for the zip archive
                    arcname = file_path.relative_to(build_path)
                    zip_file.write(file_path, arcname)

        # Seek to beginning of buffer
        zip_buffer.seek(0)

        # Return as streaming response
        return StreamingResponse(
            iter([zip_buffer.getvalue()]),
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=book.zip"
            }
        )
    except Exception as e:
        print(f"Error creating zip: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to create download: {str(e)}")


@app.post("/api/ai/generate-book", response_model=AIResponse)
async def generate_book_with_ai(request: AIBookRequest):
    """Generate book outline and initial chapters using AI"""

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file."
        )

    try:
        default_system_prompt = """You are an expert technical writer and educator specializing in creating interactive educational books using Jupyter Book format.
Your task is to create comprehensive, well-structured book content with rich Jupyter Book features including:
- Code blocks with syntax highlighting
- Mathematical equations using LaTeX
- Admonitions (notes, warnings, tips)
- Interactive quizzes using jupyterquiz
- Cross-references and citations

Generate content that is educational, engaging, and makes full use of Jupyter Book's capabilities."""

        system_prompt = request.system_prompt or default_system_prompt

        user_prompt = f"""Create a detailed book outline about: {request.topic}

Generate a JSON response with the following structure:
{{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Brief book description (2-3 sentences)",
  "chapters": [
    {{
      "title": "Chapter 1 Title",
      "description": "Brief description of what this chapter covers (2-3 sentences)",
      "content": "# Chapter Title\\n\\nBrief introduction paragraph for this chapter."
    }},
    ...
  ]
}}

Include {request.num_chapters} chapters. For each chapter:
1. Provide a clear, descriptive title
2. Write a 2-3 sentence description of what the chapter will cover
3. Only provide a minimal content with the chapter heading and a brief 1-2 sentence introduction
4. Do NOT write the full chapter content - just the skeleton/structure

This is for planning the book structure. The actual chapter content will be written later.

Return ONLY the JSON, no other text."""

        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        content = result["content"]

        return AIResponse(
            success=True,
            content=content
        )

    except Exception as e:
        error_msg = str(e)
        print(f"AI generation error: {error_msg}")
        return AIResponse(
            success=False,
            error=error_msg
        )


@app.post("/api/ai/generate-chapter", response_model=AIResponse)
async def generate_chapter_with_ai(request: AIChapterRequest):
    """Generate a single chapter using AI"""

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file."
        )

    try:
        default_system_prompt = """You are an expert technical writer creating STUNNING educational content for Jupyter Books.
Your goal is to CREATE THE MOST IMPRESSIVE, FEATURE-RICH chapter possible that showcases the full power of Jupyter Book.
Generate comprehensive chapter content using MyST Markdown with ALL available Jupyter Book features:
- Executable code blocks with syntax highlighting and proper output formatting
- Beautiful mathematical equations using LaTeX
- Eye-catching admonitions (notes, warnings, tips, important, cautions, dangers)
- Interactive quizzes using jupyterquiz syntax
- Tables, lists, blockquotes
- Cross-references and internal links
- Margin notes and sidebars
- Code cell tags and metadata
Make it VISUALLY STUNNING and PEDAGOGICALLY EXCELLENT."""

        system_prompt = request.system_prompt or default_system_prompt

        # Build feature requirements
        features = []
        if request.include_code:
            features.append("""- Include 2-3 well-commented code examples with triple backtick python blocks
  - Show input/output formatting
  - Use code cell tags like 'hide-input' or 'remove-output' where appropriate
  - Add execution numbers to cells""")
        if request.include_math:
            features.append("""- Include beautiful mathematical equations:
  - Use double dollar signs for display equations
  - Use single dollar for inline math
  - Number important equations
  - Use LaTeX environments like align, equation, etc.""")
        if request.include_admonitions:
            features.append("""- Use diverse, eye-catching admonitions:
  - triple colon note (for general information)
  - triple colon warning (for cautions)
  - triple colon tip (for helpful hints)
  - triple colon important (for critical info)
  - triple colon seealso (for related content)
  - Use custom titles for admonitions""")
        if request.include_quiz:
            features.append("- Include an interactive quiz at the end using jupyterquiz JSON syntax with multiple choice questions")
        if request.include_images:
            features.append("- Include image placeholders with descriptive alt text and captions")

        features_text = "\n".join(features) if features else "- Use standard MyST Markdown"

        chapter_desc = f"\n\nChapter description: {request.chapter_description}" if request.chapter_description else ""

        user_prompt = f"""Write a COMPREHENSIVE and VISUALLY IMPRESSIVE chapter titled "{request.chapter_title}" for the book "{request.book_title}".

Book context: {request.book_description}{chapter_desc}

The chapter MUST:
1. Be 800-1200 words (make it substantial and impressive!)
2. Use advanced MyST Markdown syntax to showcase Jupyter Book features
3. Have a clear, hierarchical structure with #, ##, ### headings
4. Be educational, engaging, and professionally written
5. Include the following Jupyter Book features:
{features_text}

IMPORTANT STYLING REQUIREMENTS:
- Use varied admonition types for visual interest (note, warning, tip, important, seealso, caution)
- Format code blocks properly with language tags
- Create comparison tables with markdown tables
- Include bulleted and numbered lists
- Use **bold** and *italic* formatting strategically
- Add blockquotes for key concepts or definitions
- Include horizontal rules (---) to separate sections
- Use definition lists for terminology
- Add margin notes with triple colon margin syntax for side comments
- Create dropdown/toggle sections with triple colon dropdown for optional deep dives
- Use panels/cards with triple colon card for highlighted content

ADVANCED JUPYTER BOOK FEATURES TO SHOWCASE:
- Margin notes: {margin} My margin note
- Sidebars: triple colon sidebar with title
- Dropdowns: triple colon dropdown with title for collapsible content
- Panels/Cards: triple colon card with title for highlighted boxes
- Epigraphs: triple colon epigraph for quotes at chapter start
- Glossary terms: {term}`term name` for referenced definitions
- Proof/Exercise blocks: triple colon prf:theorem, prf:proof, exercise

Make it look ABSOLUTELY STUNNING when rendered in Jupyter Book! Use at least 5-6 different advanced features!

Return ONLY the chapter content in MyST Markdown format. Make it impressive!"""

        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7
        )

        content = result["content"]

        return AIResponse(
            success=True,
            content=content
        )

    except Exception as e:
        error_msg = str(e)
        print(f"AI generation error: {error_msg}")
        return AIResponse(
            success=False,
            error=error_msg
        )


@app.post("/api/ai/generate-avatar")
async def generate_avatar(request: AvatarGenerationRequest):
    """
    Generate customer avatar(s) based on questionnaire responses and awareness stage

    Supports both old format (questionnaire_responses) and new format (prompt)
    Can generate a single avatar or all 5 avatars at once (awareness_stage='all')
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        # Check if using new token-based prompt format
        if request.prompt:
            # NEW FORMAT: Token-based prompt that already has all the instructions
            user_prompt = request.prompt

            # If generating ALL avatars, use the prompt directly (it should generate all 5)
            if request.awareness_stage == 'all':
                # Call OpenAI with the complete prompt
                ai = get_ai_provider()
                result = ai.chat_completion(
                    messages=[
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.8,
                    max_tokens=8000,  # Full 1,000-word profiles for all 5 avatars
                    response_format={"type": "json_object"}
                )

                print(f"DEBUG: AI Response content: '{result['content'][:200]}...'")  # Print first 200 chars
                print(f"DEBUG: AI Response keys: {result.keys()}")

                if not result["content"] or result["content"].strip() == "":
                    raise ValueError("AI returned empty content")

                result_data = json.loads(result["content"])

                # The prompt should return all 5 avatars in the structure:
                # { "unaware": {...}, "problem_aware": {...}, "solution_aware": {...}, "product_aware": {...}, "most_aware": {...} }
                return {
                    "success": True,
                    "avatars": result_data,
                    "awareness_stage": "all",
                    "tokens_used": result.get("tokens_used")
                }
            else:
                # Single avatar with new format
                ai = get_ai_provider()
                result = ai.chat_completion(
                    messages=[
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.8,
                    response_format={"type": "json_object"}
                )

                avatar_data = json.loads(result["content"])

                return {
                    "success": True,
                    "avatar": avatar_data,
                    "awareness_stage": request.awareness_stage,
                    "tokens_used": result.get("tokens_used")
                }

        else:
            # OLD FORMAT: questionnaire_responses - keep backward compatibility
            if not request.questionnaire_responses:
                raise HTTPException(status_code=400, detail="Either 'prompt' or 'questionnaire_responses' required")

            default_system_prompt = f"""You are a master copywriter and customer psychology expert specializing in Eugene Schwartz's 5 Stages of Market Awareness.

Your task is to create a DETAILED, VIVID customer avatar for someone at the "{request.awareness_stage}" stage of awareness.

This avatar should be:
- Deeply human and relatable
- Based on the questionnaire responses provided
- Psychologically accurate for their awareness stage
- Useful for crafting marketing messages and book content

Return a comprehensive JSON object with the following structure:
{{
  "name": "First name for the avatar",
  "age": 35,
  "occupation": "Their job title",
  "awareness_stage": "{request.awareness_stage}",
  "demographics": {{
    "income_range": "$XX,XXX - $XX,XXX",
    "education": "Education level",
    "location": "Where they live",
    "family_status": "Single/Married/etc"
  }},
  "psychographics": {{
    "values": ["value 1", "value 2"],
    "interests": ["interest 1", "interest 2"],
    "lifestyle": "Description of their lifestyle",
    "personality_traits": ["trait 1", "trait 2"]
  }},
  "pain_points": {{
    "primary_problem": "Their main problem",
    "symptoms": ["symptom 1", "symptom 2"],
    "impact_on_life": "How this affects their daily life",
    "current_solutions": ["what they're currently trying", "what's not working"]
  }},
  "goals_and_desires": {{
    "primary_goal": "What they want to achieve",
    "emotional_drivers": ["driver 1", "driver 2"],
    "dream_outcome": "Their ideal future state",
    "fears": ["fear 1", "fear 2"]
  }},
  "buying_behavior": {{
    "decision_process": "How they make buying decisions",
    "objections": ["objection 1", "objection 2"],
    "trust_factors": ["what builds trust", "what they value"],
    "price_sensitivity": "High/Medium/Low"
  }},
  "awareness_context": {{
    "what_they_know": "Their current level of understanding",
    "what_they_dont_know": "Knowledge gaps",
    "message_receptivity": "What messages will resonate",
    "next_stage_trigger": "What would move them to the next awareness stage"
  }},
  "day_in_the_life": "A 2-3 paragraph narrative describing a typical day"
}}

Make this avatar feel REAL. Use specific details, emotions, and insights."""

            system_prompt = request.system_prompt or default_system_prompt
            responses_text = json.dumps(request.questionnaire_responses, indent=2)

            user_prompt = f"""Based on these questionnaire responses, create a detailed customer avatar:

QUESTIONNAIRE RESPONSES:
{responses_text}

AWARENESS STAGE: {request.awareness_stage}

Generate the complete avatar profile as specified in the system prompt. Make them feel like a real person."""

            ai = get_ai_provider()
            result = ai.chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.8,
                response_format={"type": "json_object"}
            )

            avatar_data = json.loads(result["content"])

            return {
                "success": True,
                "avatar": avatar_data,
                "awareness_stage": request.awareness_stage,
                "tokens_used": result.get("tokens_used")
            }

    except Exception as e:
        import traceback
        print(f"Error in generate_avatar: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate avatar: {str(e)}")


@app.post("/api/ai/generate-single-avatar")
async def generate_single_avatar(request: dict):
    """
    Generate a SINGLE avatar for ONE awareness stage (much faster UX)
    This is called 5 times sequentially instead of generating all at once
    Accepts optional custom_system_prompt and custom_user_prompt_template
    """
    try:
        prompt = request.get('prompt', '')
        stage = request.get('stage', 'problem_aware')
        custom_system_prompt = request.get('custom_system_prompt', '')
        custom_user_prompt_template = request.get('custom_user_prompt_template', '')

        ai = get_ai_provider()

        # Use custom user prompt template if provided, otherwise use default
        if custom_user_prompt_template:
            # Replace {{stage}} placeholder with actual stage
            single_avatar_prompt = custom_user_prompt_template.replace('{{stage}}', stage.replace('_', ' ').upper())
            # Prepend the user's offer prompt
            single_avatar_prompt = f"""{prompt}

{single_avatar_prompt}"""
        else:
            # Default detailed prompt matching the reference format
            single_avatar_prompt = f"""{prompt}

Generate ONLY the {stage.replace('_', ' ').upper()} avatar. Create an extremely detailed, robust customer avatar following this EXACT structure.

You MUST make this avatar come ALIVE with extreme specificity. Include real numbers, real brand names, real movie titles, real book titles, real locations. Be as detailed as the example of David Chen, the Problem Aware Attorney.

Return ONLY valid JSON (no markdown, no code blocks):

{{
  "stage": "{stage}",
  "name": "First Last Name (use a realistic, specific name)",
  "tagline": "A compelling one-sentence description that captures their situation",
  "who_are_they": {{
    "name": "Same as above",
    "age": "Specific age (e.g., 42)",
    "gender": "Male/Female/Non-binary",
    "location": "Specific city and state/country (e.g., Austin, Texas)",
    "job": "Extremely detailed job title with company context - be specific (e.g., 'Owner/Partner at a small law firm, Chen & Associates, 3 attorneys total' NOT just 'lawyer')",
    "household_income": "Very specific income with detailed context explaining cash flow, expenses, financial pressures (e.g., 'Approximately $175,000/year - firm revenue is around $400,000, but with high overhead and partner draws, take-home is modest. Constantly feeling cash flow pressure.')",
    "marital_status": "Detailed status with family specifics (e.g., 'Married with two young children, ages 5 and 8')",
    "education_level": "Specific education background with institution type (e.g., 'Juris Doctor from a respectable, but not top-tier, law school')"
  }},
  "what_they_do_like": {{
    "brands_they_wear": ["REAL Brand 1 with detailed explanation (e.g., 'Brooks Brothers for court appearances')", "REAL Brand 2 (why)", "REAL Brand 3 (why) - Include context about price consciousness or values"],
    "hobbies": ["Hobby 1 with frequency and social context (e.g., 'Golf though rarely has time to play more than a few times a year')", "Hobby 2 (e.g., 'Coaching son's Little League team - main social outlet and way to de-stress')"],
    "favorite_movies": ["REAL Movie Title 1", "REAL Movie Title 2", "REAL Movie Title 3", "REAL Movie Title 4", "REAL Movie Title 5 - explain what draws them to these"],
    "favorite_books": ["REAL Book Title 1 by Author", "REAL Book Title 2 by Author", "REAL Book Title 3", "REAL Book Title 4", "REAL Book Title 5"],
    "visited_websites": ["REAL Site 1 (specific reason)", "REAL Site 2", "REAL Site 3", "REAL Site 4", "REAL Site 5"],
    "social_influencers": ["REAL Influencer 1 (specific reason why they follow)", "REAL Influencer 2", "REAL Influencer 3 plus local business leaders"]
  }},
  "why_are_they": {{
    "personality_traits": "Rich, detailed paragraph describing main personality traits with specific examples (e.g., 'Ambitious, driven, deeply committed to clients. Also pragmatic, risk-averse, and often stressed. Strong sense of responsibility to family and employees. Classic doer who has hard time delegating.')",
    "major_values": ["Value 1 with detailed explanation (e.g., 'Justice: Genuinely believes in the work and wants to help clients')", "Value 2 (e.g., 'Autonomy: Started own firm to be own boss')", "Value 3 (Financial Security)", "Value 4 (Reputation)", "Value 5 (Efficiency)"],
    "life_victories": ["Victory 1: Specific detailed story with context and outcome", "Victory 2: Another specific victory with emotional weight"],
    "life_failures": ["Failure 1: Specific detailed story that still affects them (e.g., 'Previous business partnership that ended badly, cost money and friendship')", "Failure 2: Personal failure that creates ongoing guilt"]
  }},
  "smart_market_questions": {{
    "keeps_awake_at_night": "Extremely detailed paragraph about specific 3am worries with concrete examples (e.g., 'Constant worry about cash flow. Did he bill enough hours this month? Will clients pay invoices on time? Can he make payroll and still have enough for family? Worries about missing critical client call and losing case to competitor.')",
    "secretly_afraid_of": "Deep, vulnerable fear paragraph with specific outcomes they dread",
    "angry_about": "Specific frustrations and who/what they blame - be detailed and emotional",
    "daily_frustrations": ["Frustration 1: Vivid, specific example that happens regularly", "Frustration 2: Another concrete daily pain point", "Frustration 3: Third specific frustration with emotional impact"],
    "secret_desire": "Their deepest, most personal dream - be specific (e.g., 'Law firm that runs itself so he can focus on high-level strategy and still be home for dinner every night')",
    "decision_bias": "Detailed explanation of their decision-making process, past burns, trust factors (e.g., 'Very skeptical of new technology and quick fixes. Been burned by expensive, difficult software. Makes decisions on clear ROI and recommendations from trusted lawyers.')",
    "unique_language": "Actual specific phrases/jargon they use daily - use quotes (e.g., 'Billable hours, retainer, discovery, motion to dismiss, client intake, conflict check')",
    "complaints_about_solutions": ["Complaint 1: Specific existing solution and why it fails them", "Complaint 2: Another specific complaint", "Complaint 3: Third complaint with why it doesn't work"]
  }},
  "going_deep": {{
    "negative_emotions": ["Emotion 1: Detailed description of when and why felt with specific triggering situations (e.g., 'Anxiety: Every time he opens bank account on Friday afternoons before making payroll, feels chest tightness and racing thoughts')", "Emotion 2: Another specific negative emotion with concrete context", "Emotion 3: Third emotion with real-world trigger"],
    "positive_emotions_from_solution": ["Emotion 1: Specific transformation with before/after contrast (e.g., 'Relief: From constant 3am money anxiety to sleeping through the night knowing clients are paying automatically')", "Emotion 2: Another concrete emotional transformation", "Emotion 3: Third transformation with vivid description"],
    "beliefs_about_world": ["Belief 1: Specific worldview with explanation (e.g., 'Hard work always pays off - though starting to question this as he works 60-hour weeks with little to show for it')", "Belief 2: Another specific belief about how things work", "Belief 3: Third belief that shapes their decisions"],
    "lifestyle_desire": "Extremely detailed ultimate lifestyle vision - be specific about time, money, relationships, daily routine (e.g., 'Run a law firm that operates smoothly without him micromanaging everything. Work 40 hours per week max, make $250k+ per year, home by 6pm for family dinner every night, weekends completely free, respected in legal community, financially secure enough to send both kids to college without loans.')"
  }},
  "purchasing_habits": {{
    "price_tolerance": "Very specific price range with detailed reasoning and context (e.g., 'Would pay up to $300/month for a solution that demonstrably saves him 10+ hours per week or increases revenue by $2,000+/month. Extremely price-sensitive below that threshold. Has been burned by $5,000+ software purchases that promised everything but delivered little. Prefers monthly subscriptions over large upfront costs due to cash flow concerns.')",
    "purchase_triggers": "Detailed multi-paragraph explanation covering: emotional triggers (pain points that finally break them), logical triggers (ROI calculations, peer recommendations), timing factors (quarterly reviews, tax season), and specific proof needed before buying (e.g., 'Needs to see 3 things before buying: (1) testimonial from another small law firm owner he trusts, (2) free trial or demo showing it actually works with his specific workflow, (3) clear breakdown showing time saved or revenue gained will justify cost within 90 days. Emotional trigger is usually a crisis moment - missed deadline, lost client, or particularly bad week where everything falls apart.')",
    "common_objections": "Detailed list of 5+ specific objections with exact phrasing (e.g., 'Too expensive for what I get', 'Looks complicated - don\\'t have time to learn new software', 'What if it doesn\\'t integrate with my current case management system?', 'How do I know it will actually work for a small firm like mine vs big corporate firms?', 'What happens to my data if I cancel?', 'Been burned before by software that promised too much')"
  }},
  "primary_wants": {{
    "wants_to_gain": "Multiple specific, concrete gains with emotional weight - use bullet points or detailed paragraph (e.g., 'Time: Specifically wants 15+ hours back per week to spend with family and on business development, not administrative tasks. Money: Clear path to $250k+ annual income with predictable cash flow. Respect: Recognition as successful attorney in local legal community. Peace of mind: End the 3am anxiety about money and missed details. Control: Systems that work without constant supervision. Growth: Ability to take on 30% more clients without working more hours or hiring expensive staff.')",
    "wants_to_avoid": "Detailed fears and risks with specific nightmare scenarios (e.g., 'Missing critical deadline and getting sued for malpractice - this is the ultimate nightmare that keeps him up at night. Losing firm due to cash flow crisis - has seen other solo attorneys go bankrupt. Burning out and resenting the career he once loved. Disappointing his family by working constant evenings and weekends. Being seen as a failure by peers or family. Getting stuck in survival mode forever with no path to growth. Making a major financial mistake like bad software purchase or bad hire that sets him back years.')"
  }},
  "empathy_map": {{
    "thinks": ["Internal thought 1: Specific recurring thought with context (e.g., 'I should have gone into corporate law - at least I\\'d have predictable hours and steady paycheck')", "Internal thought 2: Another specific thought (e.g., 'Am I billing enough hours this month to cover expenses?')", "Internal thought 3: Self-doubt or worry (e.g., 'What if clients find a better lawyer and leave me?')", "Internal thought 4: Hope or aspiration (e.g., 'If I could just get 5 more retainer clients, everything would stabilize')", "Internal thought 5: Decision-making thought (e.g., 'Is this expense really necessary or am I just being sold to?')"],
    "feels": ["Emotion/feeling 1: Specific emotional state with trigger (e.g., 'Overwhelmed - drowning in administrative tasks while trying to practice law')", "Emotion/feeling 2: Another emotion (e.g., 'Guilty about missing kids\\' events due to work')", "Emotion/feeling 3: Third feeling (e.g., 'Anxious about money despite working constantly')", "Emotion/feeling 4: Fourth feeling (e.g., 'Proud of helping clients but frustrated by business side')"],
    "says": ["Quote 1: Exact phrase they say regularly (e.g., 'I don\\'t have time for this right now')", "Quote 2: Another common phrase (e.g., 'Let me check my calendar and get back to you')", "Quote 3: Complaint they voice (e.g., 'This software is supposed to make things easier, not harder')", "Quote 4: Aspiration they express (e.g., 'I just want to focus on practicing law, not running a business')"],
    "does": ["Action 1: Specific daily behavior (e.g., 'Checks email obsessively - first thing in morning, between meetings, before bed - afraid of missing important client message')", "Action 2: Work pattern (e.g., 'Works from 7am to 7pm most days, then another 2 hours after kids go to bed')", "Action 3: Coping mechanism (e.g., 'Drinks 4-5 cups of coffee daily to stay alert through exhaustion')", "Action 4: Decision behavior (e.g., 'Researches purchases extensively, reads reviews, asks colleagues before buying anything over $100')", "Action 5: Stress response (e.g., 'Snaps at staff when overwhelmed, then feels guilty about it later')"]
  }}
}}

Be EXTREMELY specific and detailed. Use real names, real brands, real numbers. Make this person come alive.

FINAL REMINDER: This avatar must be as detailed and robust as a real person you know personally. Include:
- REAL brand names (Brooks Brothers, not "professional clothing brand")
- REAL movie/book titles with authors
- SPECIFIC numbers ($175,000/year, not "good income")
- SPECIFIC locations (Austin, Texas, not "major city")
- SPECIFIC ages (42, not "middle-aged")
- VIVID details that make this person unforgettable
- CONCRETE examples, not abstract descriptions

Think: Would someone reading this avatar feel like they could pick this person out of a crowd and know exactly what motivates them? If not, add MORE detail.

CRITICAL JSON FORMATTING RULES:
1. Use double quotes for all strings
2. Escape any quotes inside strings with backslash: \"
3. Do NOT include newlines inside strings - use \\n instead
4. Do NOT use single quotes
5. Ensure all brackets and braces are properly closed
6. Do NOT add trailing commas
7. Return ONLY valid JSON - no explanations before or after"""

        # Generate with enough tokens for detailed avatar
        # Build messages array with optional custom system prompt
        messages = []
        if custom_system_prompt:
            messages.append({"role": "system", "content": custom_system_prompt})
        messages.append({"role": "user", "content": single_avatar_prompt})

        full_content = ""
        async for chunk in ai.chat_completion_stream(
            messages=messages,
            temperature=0.8,
            max_tokens=16000  # Comprehensive avatar with ALL 8 sections fully detailed
        ):
            full_content += chunk

        # Parse JSON with ROBUST error handling and auto-repair
        content_to_parse = full_content.strip()

        # Remove markdown code blocks if present
        if content_to_parse.startswith("```json"):
            content_to_parse = content_to_parse.split("```json")[1].split("```")[0].strip()
        elif content_to_parse.startswith("```"):
            content_to_parse = content_to_parse.split("```")[1].split("```")[0].strip()

        # Strategy 1: Try direct parse
        try:
            avatar_data = json.loads(content_to_parse)
            return {"success": True, "avatar": avatar_data, "stage": stage}
        except json.JSONDecodeError as je:
            print(f"⚠️  JSON Parse Error (attempt 1): {je}")
            print(f"Error position: line {je.lineno} column {je.colno}")

        # Strategy 2: Auto-fix common issues
        import re
        try:
            fixed_content = content_to_parse

            # Fix trailing commas
            fixed_content = re.sub(r',(\s*[}\]])', r'\1', fixed_content)

            # Fix unescaped quotes in strings (basic attempt)
            # This is tricky but we'll try to fix obvious cases
            fixed_content = fixed_content.replace('\\"', '<<<ESCAPED_QUOTE>>>')
            fixed_content = re.sub(r'([^\\])"([^"]*?)"([^:])', r'\1"<<<QUOTE>>>\3', fixed_content)
            fixed_content = fixed_content.replace('<<<ESCAPED_QUOTE>>>', '\\"')

            # Fix unterminated strings by adding closing quote and brace if truncated
            if not fixed_content.rstrip().endswith('}'):
                # Count opening and closing braces
                open_braces = fixed_content.count('{')
                close_braces = fixed_content.count('}')

                # If string is unterminated, close it
                if '"' in fixed_content[-100:] and fixed_content.count('"') % 2 != 0:
                    fixed_content += '"'

                # Add missing closing braces
                for _ in range(open_braces - close_braces):
                    fixed_content += '\n}'

            avatar_data = json.loads(fixed_content)
            print("✅ JSON repaired successfully!")
            return {"success": True, "avatar": avatar_data, "stage": stage}
        except Exception as e2:
            print(f"⚠️  JSON repair failed (attempt 2): {e2}")

        # Strategy 3: Try to extract whatever valid JSON we can
        try:
            # Find the last complete closing brace
            last_valid = content_to_parse.rfind('"}')
            if last_valid > 0:
                # Try to close the JSON properly from there
                truncated = content_to_parse[:last_valid + 2]

                # Count and balance braces
                open_braces = truncated.count('{')
                close_braces = truncated.count('}')
                for _ in range(open_braces - close_braces):
                    truncated += '\n}'

                avatar_data = json.loads(truncated)
                print("✅ Partial JSON extracted successfully!")
                print(f"⚠️  Warning: Avatar may be incomplete")
                return {"success": True, "avatar": avatar_data, "stage": stage, "warning": "Partial data - some fields may be missing"}
        except Exception as e3:
            print(f"⚠️  Partial extraction failed (attempt 3): {e3}")

        # All strategies failed - return detailed error
        print(f"\n❌ All JSON parsing strategies failed!")
        print(f"Full content length: {len(full_content)} characters")
        print(f"Content preview:\n{content_to_parse[:1000]}")
        print(f"Content ending:\n{content_to_parse[-500:]}")

        return {
            "success": False,
            "error": f"Failed to parse avatar JSON after 3 attempts. Length: {len(content_to_parse)} chars. Content may be truncated or malformed.",
            "content_preview": content_to_parse[:500],
            "content_ending": content_to_parse[-200:]
        }

    except Exception as e:
        import traceback
        print(f"Error in generate_single_avatar: {str(e)}")
        print(traceback.format_exc())
        return {"success": False, "error": str(e)}


@app.get("/api/ai/generate-avatar-stream")
async def generate_avatar_stream(prompt: str, awareness_stage: str = 'all'):
    """
    Streaming version of generate_avatar - sends progress updates in real-time
    """
    async def event_generator():
        try:
            yield f"data: {json.dumps({'status': 'starting', 'message': 'Initializing AI request...'})}\n\n"

            ai = get_ai_provider()
            user_prompt = prompt

            yield f"data: {json.dumps({'status': 'generating', 'message': 'Generating avatar profile... This may take 2-3 minutes.'})}\n\n"

            # Collect streaming response (don't request JSON format - it doesn't work well with streaming)
            full_content = ""
            char_count = 0
            last_update_count = 0

            async for chunk in ai.chat_completion_stream(
                messages=[{"role": "user", "content": user_prompt}],
                temperature=0.8,
                max_tokens=8000
            ):
                full_content += chunk
                char_count += len(chunk)

                # Send progress update every ~200 characters (more frequent updates)
                if char_count - last_update_count >= 200:
                    # More realistic progress: assume ~6000 chars for full response
                    progress = min(85, int((char_count / 6000) * 100))

                    # More descriptive messages based on progress
                    if progress < 20:
                        message = f"🎯 Analyzing your offer and identifying target audience... ({char_count} chars)"
                    elif progress < 40:
                        message = f"👥 Building demographic profiles across awareness stages... ({char_count} chars)"
                    elif progress < 60:
                        message = f"🧠 Developing psychographic insights and pain points... ({char_count} chars)"
                    elif progress < 80:
                        message = f"💡 Crafting buyer psychology and messaging strategies... ({char_count} chars)"
                    else:
                        message = f"✨ Finalizing all 5 customer avatars... ({char_count} chars)"

                    yield f"data: {json.dumps({'status': 'generating', 'progress': progress, 'message': message})}\n\n"
                    last_update_count = char_count

            yield f"data: {json.dumps({'status': 'parsing', 'progress': 90, 'message': '🔍 Parsing and validating all 5 avatars...'})}\n\n"

            # Try to extract JSON from the response (handle markdown code blocks)
            content_to_parse = full_content.strip()
            if content_to_parse.startswith("```json"):
                content_to_parse = content_to_parse.split("```json")[1].split("```")[0].strip()
            elif content_to_parse.startswith("```"):
                content_to_parse = content_to_parse.split("```")[1].split("```")[0].strip()

            yield f"data: {json.dumps({'status': 'parsing', 'progress': 95, 'message': '✅ Validating avatar data structure...'})}\n\n"

            # Parse the complete JSON
            result_data = json.loads(content_to_parse)

            yield f"data: {json.dumps({'status': 'parsing', 'progress': 98, 'message': '🎉 All avatars generated successfully!'})}\n\n"

            # Send avatars progressively as we parse them
            # This allows frontend to display each avatar as it's available
            avatar_stages = ['problem_aware', 'solution_aware', 'product_aware', 'most_aware', 'unaware']
            for stage in avatar_stages:
                if stage in result_data:
                    yield f"data: {json.dumps({'status': 'avatar_ready', 'stage': stage, 'avatar': result_data[stage]})}\n\n"

            # Send final result
            yield f"data: {json.dumps({'status': 'complete', 'data': {'success': True, 'avatars': result_data, 'awareness_stage': 'all'}})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/ai/generate-avatar-diary")
async def generate_avatar_diary(request: DiaryGenerationRequest):
    """
    Generate diary entries for an avatar (Before/During/After their transformation)

    This creates emotional, visceral diary entries that show the avatar's journey
    before encountering the solution, during their transformation, and after success
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        # Build default system prompts for each diary type
        diary_prompts = {
            "before": """You are a creative writer specializing in emotional, first-person narrative.

Write a DIARY ENTRY from the perspective of the customer avatar BEFORE they discovered the solution.

**FORMAT REQUIREMENTS:**
- Title: "## Entry 1: Before Using the Product"
- Include a specific date and time (e.g., "**March 15th, 11:47 PM**")
- Written in first person, as if they're writing in their diary late at night
- 600-800 words of deeply emotional, visceral narrative
- Multiple paragraphs showing the full scope of their struggle

**CONTENT REQUIREMENTS:**
- Start with a scene-setting detail (time of night, physical setting, emotional state)
- Show specific examples from their day illustrating their pain points
- Use concrete numbers and details (e.g., "17 phone calls", "6 hours of actual work")
- Include physical manifestations of stress (tension, anxiety, sleeplessness)
- Show the impact on their personal life (family, relationships, health)
- Use internal dialogue and raw emotional honesty
- End with a sense of desperation and questioning whether things can change

**STYLE:**
- Use sensory details and visceral language
- Vary sentence length for emotional impact
- Include italics for emphasis on key emotional moments
- Make us FEEL their exhaustion, frustration, and desperation
- Write as if this is a real person pouring their heart out to their diary""",

            "during": """You are a creative writer specializing in emotional, first-person narrative.

Write a DIARY ENTRY from the perspective of the customer avatar DURING their first experience with the product/solution.

**FORMAT REQUIREMENTS:**
- Title: "## Entry 2: During Their First Use of Product"
- Include a specific date and time 2-3 weeks after the "before" entry (e.g., "**April 3rd, 2:15 PM**")
- Written in first person, as if they're writing during a break in their day
- 600-800 words of detailed, observant narrative
- Multiple paragraphs showing the discovery process

**CONTENT REQUIREMENTS:**
- Start with noticing something unusual or different
- Show their skepticism and hesitation about trying the solution
- Include specific examples of the solution in action
- Describe the internal conflict between hope and fear
- Show them processing this new experience in real-time
- Include specific interactions or moments that surprised them
- End with cautious optimism and the beginning of trust

**STYLE:**
- Use present-tense observations mixed with reflection
- Show their mental dialogue as they evaluate the new solution
- Include italics for internal thoughts and realizations
- Balance skepticism with growing hope
- Make us FEEL their tentative relief and cautious excitement
- Write as if they're documenting something they can barely believe""",

            "after": """You are a creative writer specializing in emotional, first-person narrative.

Write a DIARY ENTRY from the perspective of the customer avatar AFTER their successful transformation using the product.

**FORMAT REQUIREMENTS:**
- Title: "## Entry 3: After Using The Product"
- Include a specific date and time 6-8 weeks after the "before" entry (e.g., "**May 18th, 8:30 PM**")
- Written in first person, from home in a moment of reflection
- 700-900 words of grateful, transformed narrative
- Multiple paragraphs showing the full scope of their new reality

**CONTENT REQUIREMENTS:**
- Start with a scene showing their new normal (being present with family, relaxing)
- Include specific metrics and improvements (e.g., "billable hours up 23%")
- Contrast their old self with their new self using specific examples
- Show the ripple effects on their personal life, relationships, and well-being
- Include observations from others (spouse, kids) noticing the change
- Describe specific moments of realization about how much has changed
- Reference back to the "before" state to highlight the transformation
- End with hope for the future and genuine gratitude

**STYLE:**
- Use reflective, grateful language
- Include concrete details and numbers that prove the transformation
- Show emotional depth without being overly dramatic
- Use italics for key realizations and emotional moments
- Make us FEEL their relief, joy, and renewed sense of purpose
- Write as if they're marveling at how different their life has become"""
        }

        default_system_prompt = diary_prompts.get(request.diary_type, diary_prompts["before"])
        system_prompt = request.system_prompt or default_system_prompt

        # Build user prompt with avatar context
        avatar_text = json.dumps(request.avatar_profile, indent=2)
        book_context_text = ""
        if request.book_context:
            book_context_text = f"\n\nBOOK/PRODUCT CONTEXT:\n{json.dumps(request.book_context, indent=2)}"

        user_prompt = f"""Write a diary entry for this avatar:

AVATAR PROFILE:
{avatar_text}

DIARY TYPE: {request.diary_type.upper()}{book_context_text}

Write the diary entry as specified. Make it deeply personal and emotionally resonant."""

        # Call OpenAI
        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.9,  # High temperature for creative, emotional writing
            max_tokens=2000  # Increased for longer, more detailed diary entries (600-900 words)
        )

        diary_content = result["content"]

        return {
            "success": True,
            "diary_entry": diary_content,
            "diary_type": request.diary_type,
            "avatar_name": request.avatar_profile.get("name", "Unknown"),
            "tokens_used": result.get("tokens_used")
        }

    except Exception as e:
        import traceback
        print(f"Error in generate_avatar_diary: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate diary entry: {str(e)}")


@app.post("/api/ai/generate-brand-identity")
async def generate_brand_identity(request: Dict[str, Any]):
    """
    Generate brand identity based on Problem Aware avatar profile

    Creates brand voice, messaging, tone attributes, and content themes
    tailored to resonate with the target audience
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        avatar_profile = request.get('avatar_profile', {})

        system_prompt = """**ROLE & GOAL:**

Act as a "Brand & Design Syndicate," a specialized team hired to translate strategic research into a comprehensive and actionable brand identity and design system. Your team consists of:

1. **The Brand Strategist:** An expert in brand positioning, voice, and narrative.
2. **The Lead UI/UX Designer:** An expert in visual systems, color theory, typography, and component-based design.
3. **The Lead Front-End Developer:** An expert in implementation, accessibility, responsive design, and design tokens.

Your goal is to create a formal **Brand Identity & Design System** as a single markdown document.

**TASK: GENERATE THE BRAND IDENTITY & DESIGN SYSTEM**

Produce a comprehensive markdown document structured as follows:

# [Business Name] Brand Identity & Design System

## Brand Identity
(Contribution led by the **Brand Strategist**)

### Brand Essence
Distill the core offering into 5-7 core brand attributes. Examples: Professionalism, Innovation, Efficiency, Reliability, Security, Transformation, Empowerment.

### Brand Voice
- **Tone**: Define the tone based on the target audience (e.g., Professional, confident, reassuring, empowering, authoritative).
- **Language**: Describe the language style (e.g., Clear, benefit-focused, emotional yet professional).
- **Communication Style**: Describe the overall approach (e.g., Solution-oriented, emphasizing transformation and outcomes).

### Brand Narrative
Write a compelling 2-3 paragraph story that tells what the business does, for whom, and why it matters. Make it emotional and inspiring.

## Design System
(Contribution led by the **Lead UI/UX Designer** and **Lead Front-End Developer**)

### Color Palette

#### Primary Colors
- **Brand Gradient**: Define a modern gradient that represents the brand's energy and transformation
- **Primary Colors**: Extract 6-8 key colors with hex codes, naming each (e.g., Sunset Orange #FF6B35 - Energy, Ocean Teal #00B4D8 - Trust)

#### Secondary Colors
Define neutral colors for UI:
- Dark Blue (primary text) - #1A2332
- Medium Gray (secondary text) - #64748B
- Light Gray (backgrounds) - #F1F5F9
- White - #FFFFFF
- Black - #0F172A

#### Functional Colors
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Info: #3B82F6

### Typography

#### Font Family
- **Primary Font**: Choose a modern, highly-readable sans-serif (e.g., **Inter**, **Plus Jakarta Sans**, **Satoshi**). Justify the choice.
- **Secondary Font**: Choose an elegant serif for major headlines (e.g., **DM Serif Display**, **Playfair Display**). Justify the choice.

#### Font Sizes
Create a complete typographic scale:
- **H1 (Display)**: 3.75rem / 60px, line-height: 1.1, weight: 700
- **H2**: 3rem / 48px, line-height: 1.2, weight: 700
- **H3**: 2.25rem / 36px, line-height: 1.3, weight: 600
- **H4**: 1.875rem / 30px, line-height: 1.4, weight: 600
- **H5**: 1.5rem / 24px, line-height: 1.5, weight: 600
- **H6**: 1.25rem / 20px, line-height: 1.5, weight: 600
- **Body (Regular)**: 1rem / 16px, line-height: 1.6, weight: 400
- **Body (Small)**: 0.875rem / 14px, line-height: 1.5, weight: 400
- **Body (XSmall)**: 0.75rem / 12px, line-height: 1.4, weight: 400
- **Caption**: 0.75rem / 12px, line-height: 1.4, weight: 500

#### Font Weights
- Light (300)
- Regular (400)
- Medium (500)
- Semibold (600)
- Bold (700)

### UI Components

#### 21st.dev Components
List modern component categories: Navigation (animated nav, mega menus), Layout (responsive grids, containers), Forms (animated inputs, select menus), Feedback (toasts, alerts), Data Display (cards, badges), Disclosure (accordions, tabs).

#### MagicUI Components
List 5+ animated components: Animated Cards with Hover Effects, Scroll-Triggered Animations, Testimonial Carousels with Auto-Play, Animated Icons and Illustrations, Progress Indicators, Loading Skeletons, Particle Effects.

#### reactbits.dev Components
List component categories: Advanced Navigation, Interactive Forms, Data Visualization, Modal Systems, Tooltip Libraries.

#### Custom Components
Propose 3-4 essential custom components specific to the business offering.

### Micro-Interactions
Define 5-6 subtle animations:
- **Button Hover**: Scale 1.02, shadow lift
- **Form Focus**: Border glow, scale 1.01
- **Loading States**: Skeleton screens, pulse animations
- **Success Actions**: Checkmark animation, confetti
- **Navigation**: Smooth scroll, active indicator slide
- **Scrolling**: Fade-in elements, parallax effects

### Responsive Design
- **Mobile-First Approach**: Build for mobile, enhance for desktop
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Mobile Adaptations**: Hamburger menu, stacked layouts, larger touch targets (48px minimum)

### Accessibility
- Color Contrast: WCAG AA (4.5:1 for text)
- Keyboard Navigation: Full tab support
- Screen Reader Support: Proper ARIA labels
- Visible Focus Indicators: 2px outline
- Respect Reduced Motion: Disable animations when preferred

### Dark/Light Mode
Support both modes with DaisyUI themes, automatic system detection, and user toggle.

## Implementation Guidelines

### CSS Framework
- Tailwind CSS (utility-first)
- DaisyUI (component library)
- Custom utilities for brand-specific needs

### Animation Library
- **Framer Motion** for complex animations
- **Tailwind Animations** for simple transitions

### Icon System
- **Lucide React** (modern, consistent)
- Custom SVGs for brand-specific icons

### Asset Management
- SVG for icons and illustrations
- WebP for images (with fallbacks)
- MP4/WebM for video

### Code Structure
- Component-Based Architecture (atomic design)
- Utility-First CSS
- Responsive Variants (mobile-first)

## Design Tokens

```json
{
  "colors": {
    "primary": {
      "50": "#FFF7ED",
      "100": "#FFEDD5",
      "200": "#FED7AA",
      "300": "#FDBA74",
      "400": "#FB923C",
      "500": "#F97316",
      "600": "#EA580C",
      "700": "#C2410C",
      "800": "#9A3412",
      "900": "#7C2D12"
    },
    "neutral": {
      "dark": "#1A2332",
      "medium": "#64748B",
      "light": "#F1F5F9",
      "white": "#FFFFFF",
      "black": "#0F172A"
    },
    "functional": {
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444",
      "info": "#3B82F6"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "Inter, sans-serif",
      "secondary": "DM Serif Display, serif"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  },
  "borderRadius": {
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "1rem",
    "full": "9999px"
  }
}
```

**IMPORTANT**: Ensure the entire output is a single, clean markdown document. Do not include any conversational text. The document should be comprehensive (2000+ words), professionally formatted, and immediately actionable for designers and developers."""

        avatar_text = json.dumps(avatar_profile, indent=2)

        user_prompt = f"""Based on this Problem Aware customer avatar, create a complete brand identity:

AVATAR PROFILE:
{avatar_text}

Generate brand identity that will:
1. Speak directly to their pain points and desires
2. Use language and tone they relate to
3. Address them at their current awareness stage (Problem Aware)
4. Build trust and credibility
5. Guide them toward the solution

Return the complete brand identity as specified."""

        # Call OpenAI - returns markdown document
        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=6000  # Increased for comprehensive content
        )

        brand_identity_markdown = result["content"]

        return {
            "success": True,
            "brand_identity": brand_identity_markdown,  # Now returns markdown string
            "tokens_used": result.get("tokens_used")
        }

    except Exception as e:
        import traceback
        print(f"Error in generate_brand_identity: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate brand identity: {str(e)}")


@app.post("/api/ai/generate-landing-page-spec")
async def generate_landing_page_spec(request: Dict[str, Any]):
    """
    Generate a comprehensive landing page specification (PRD)

    Creates a complete 17-section PRD for building a high-converting landing page
    based on the Problem Aware avatar, brand identity, and diary entries
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        problem_aware_avatar = request.get('problem_aware_avatar', {})
        brand_identity = request.get('brand_identity', {})
        diary_entries = request.get('diary_entries', {})
        offer_context = request.get('offer_context', {})

        system_prompt = """You are a Senior Product Manager & UX Architect with 15+ years of experience in high-converting landing pages and conversion rate optimization.

**YOUR MISSION**: Create a COMPREHENSIVE, production-ready landing page specification (PRD) for a product/service targeting the **Problem Aware** audience.

This must be a complete Product Requirements Document that a designer and developer could immediately use to build a high-converting landing page. Think of this as a $50K+ agency-level deliverable.

**OUTPUT FORMAT**: Return a detailed markdown document (3000-5000 words minimum) with the following structure:

# Product Requirements Document: [Product Name] Landing Page

## Executive Overview
- Product: [Name]
- Purpose: Convert Problem Aware decision-makers through trust-building, ROI demonstration, and detailed value proposition
- Target Audience: [Demographics + psychographics from avatar]

---

## Page Architecture & UI Components

### 1. Navigation Bar
**Requirements:**
- Position: Fixed/sticky header, remains visible on scroll
- Components: Logo (left), Primary nav links (Platform, Solutions, Resources, Pricing), Secondary CTAs ("Request Demo" primary, "Sign In" text link)
- Behavior: Transparent on hero, solid background after scroll. Hamburger menu on mobile with slide-out drawer
- Specifications: Height 72px desktop/60px mobile, max-width 1440px centered, z-index 1000

### 2. Hero Section
**Requirements:**
- Layout: Two-column split (60/40) - Copy left, Visual right
- **Copy Structure:**
  - Pre-headline: Small badge with credibility indicator (e.g., "Trusted by 500+ [Target Companies]")
  - Headline (H1): Clear, outcome-focused statement (60-80 chars). Use power words: Transform, Accelerate, Eliminate
  - Subheadline: 2-3 sentences expanding on value proposition (150-200 chars). Focus on specific business outcomes
  - Trust Indicators: Logo bar of recognizable client companies (5-7 logos, grayscale with hover color)
  - **Dual CTA Strategy:**
    - Primary: "Schedule a Demo" (high-contrast button)
    - Secondary: "See How It Works" (outline/ghost button to demo video)
    - Micro-copy: "Free consultation • No credit card • 30-day trial"
- **Visual Component**: Product screenshot or interactive demo preview (800x600px minimum, retina optimized). Show actual dashboard/interface with subtle animation or video loop (15-20s). Include visible ROI/results (graphs trending up, deal counts)
- **Technical Specs**: Section height 90vh minimum, subtle gradient/geometric pattern background (brand colors), responsive at 1024px (stack to single column), CTA buttons 48px minimum touch target

### 3. Problem/Pain Point Section
**Purpose:** Establish problem awareness and relate to avatar's daily challenges
**Structure:** Statement + Statistics framework

- Section Headline: Question format surfacing the pain (e.g., "Still Managing [Process] with Spreadsheets and Guesswork?")
- Problem Statements: 3-column grid presenting common pain points
  - Column 1: "[Pain Title]" - Description of specific challenge
  - Column 2: "[Pain Title]" - Description of specific challenge
  - Column 3: "[Pain Title]" - Description of specific challenge
- Supporting Statistics: Each pain point includes stat from industry research (Large number with source citation)
- Visual Treatment: Icons/illustrations for each pain point (line icons, consistent stroke, brand color accent)
- **Technical**: Contrasting section background, padding 120px top/bottom desktop/80px mobile, CSS Grid 3 columns desktop/1 column mobile

### 4. Solution Positioning Section
**Purpose:** Position product as comprehensive answer to stated problems
**Structure:** Narrative + Feature Framework

- Headline: Direct solution statement
- Solution Narrative: 2-3 paragraphs explaining approach (not features yet)
  - Para 1: Bridge from problem to solution philosophy
  - Para 2: Core methodology/approach
  - Para 3: Outcome-focused statement
- Visual Proof: Side-by-side comparison or transformation visual (Before State vs After State)
- Unique Value Proposition Callout: Highlighted box with key differentiator
- **Technical**: Centered content max-width 1200px, visual element 60% width desktop/full width mobile, scroll-triggered fade-in animations

### 5. Features & Benefits Section
**Purpose:** Detail specific capabilities tied to business outcomes
**Structure:** Alternating layout (feature-benefit pairs)

- Number of Features: 4-6 primary features, each as subsection
- Per Feature Structure:
  - Icon/visual representation
  - Feature name (H3)
  - Benefit-focused description (3-4 sentences with specific outcome metrics)
  - Supporting screenshot or diagram (600x450px)
- Layout Pattern: Alternating left/right (Feature 1: Image right/text left, Feature 2: Text right/image left, etc.)
- **Technical**: Full-width container max-width 1200px, 100px spacing between blocks, responsive stack at 768px, fade + slide animations on scroll

### 6. ROI Calculator Section (Optional but Recommended)
**Purpose:** Provide tangible, personalized value demonstration
**Type:** Interactive calculator tool

- Input Fields: Number of [users], Average [metric], Current [baseline], Hours spent on [task]
- Calculation Logic: Show time saved, productivity gain, annual ROI
- Output Display: Large prominent number showing annual value, breakdown of savings categories, comparison visualization
- Visual Design: Centered card max-width 900px, brand accent for results, large numbers (48-60px) for main figure
- **Technical**: React component with real-time calculation updates, input validation, results animate on calculation, mobile-optimized

### 7. Social Proof / Case Study Section
**Purpose:** Build credibility through customer success stories

- Primary Case Study: Full-width feature with company logo, results, quote
  - Elements: Customer company logo, industry/size context, 3 key metrics in large text
  - Example: "3x Pipeline Growth | 60% Faster Cycle | $2M Additional Revenue"
  - Customer quote (2-3 sentences) with name, title, company photo
  - CTA: "Read Full Case Study" link
- Supporting Testimonials: 3-column grid of testimonial cards (short quote, customer name/title/company, company logo, star rating)
- Stats Bar: 4-5 aggregate metrics (e.g., "500+ Companies | 10,000+ Users | 94% Retention")
- **Technical**: Full-width background, content max-width 1200px, cards equal height (flexbox/grid), stack 2 columns tablet/1 column mobile

### 8. Pricing Section (if applicable)
**Purpose:** Present transparent pricing for different business sizes
**Structure:** 3-tier pricing table

- Tier 1: Starter (small teams) - Price, monthly/annual toggle, 5-7 core features, user limit, "Start Free Trial" CTA
- Tier 2: Professional (MOST POPULAR - highlighted) - "Best Value" badge, price with savings, 8-10 enhanced features, primary CTA styling
- Tier 3: Enterprise (custom pricing) - "Contact Us" approach, premium features, emphasis on customization/dedicated support, "Schedule Demo" CTA
- Feature Comparison Table: Expandable detailed comparison (features as rows, plans as columns)
- FAQ Micro-Section: 3-4 pricing questions
- Trust Indicators: "No credit card" "Cancel anytime" "30-day money-back guarantee"
- **Technical**: Max-width 1400px, cards equal height minimum 500px, annual/monthly toggle with price animation, responsive stack vertically on mobile

### 9. Integration & Security Section
**Purpose:** Address technical buyers' concerns

- Integrations Component: "Connects With Your Existing Stack" - 12-20 partner logos in grid (CRM, Communication, etc.), grayscale with hover to color
- Security & Compliance: "Enterprise-Grade Security & Compliance" - Certification badges (SOC 2, GDPR, ISO 27001, CCPA), security features list (256-bit encryption, SSO/SAML, RBAC)
- **Technical**: 50/50 split desktop/stacked mobile, logos max height 50px SVG, badges max height 80px, padding 100px top/bottom

### 10. Demo/Video Section
**Purpose:** Self-service product walkthrough

- Headline: "See [Product] in Action"
- Video Player: 2-4 minute walkthrough (embedded YouTube/Vimeo/custom), professional thumbnail, 16:9 aspect ratio max-width 900px centered
- Video Context: Brief description, key timestamps, option to skip to demo request
- Secondary CTA: "Ready to try it yourself? Schedule a personalized demo"
- **Technical**: Lazy load video, closed captions/subtitles, maintain aspect ratio on all devices

### 11. Final CTA Section
**Purpose:** Strong conversion push before footer

- Headline: Direct, action-oriented (e.g., "Ready to Transform Your [Process]?")
- Supporting Text: 1-2 sentences reinforcing value and ease
- Dual CTAs: Primary "Start Free Trial" (large button), Secondary "Schedule a Demo" (outline button)
- Trust Elements: Icons/text showing key benefits ("30-day trial" "No credit card" "Setup in 5 minutes")
- **Technical**: Full-width section, brand gradient/solid accent background (high contrast), centered max-width 800px, generous padding 150px top/bottom, large buttons 60px height minimum

### 12. Footer
**Structure:** Multi-column layout with organized link groups

- Column 1: Company Info (Logo, tagline, social icons, copyright)
- Column 2: Product (Features, Integrations, Pricing, Security, Changelog)
- Column 3: Resources (Blog, Case Studies, Help Center, API Docs, Webinars)
- Column 4: Company (About, Careers, Contact, Press Kit, Partners)
- Column 5: Legal (Privacy Policy, Terms, Cookie Policy, GDPR, Acceptable Use)
- Optional Newsletter Signup: Email input + Subscribe button
- **Technical**: Dark/light contrast, desktop 5 columns equal width, tablet 2-3 columns, mobile single column (accordion style optional), padding 80px top/40px bottom

---

## Visual Style Guide

### Color Palette
Extract from brand identity provided - specify Primary, Secondary, Accent, Neutral (Background, Text Primary/Secondary, Borders), Semantic (Success, Warning, Error, Info) with exact hex codes

### Typography
- Font Families: Headings and Body (specify from brand)
- Type Scale: H1-H6 with exact px/rem, line-height, font-weight values for each
- Body Large/Regular/Small/Caption specifications

### Spacing System
Base unit 8px, Scale: 8/16/24/32/40/48/64/80/100/120px
Section padding: Desktop 120px, Tablet 80px, Mobile 60px

### Component Styles
- Buttons: Primary (background, text, border-radius 8px, padding 16px 32px, font-size 16px font-weight 600, hover 10% darker)
- Cards: Background, border, border-radius 12px, box-shadow, padding 32px, hover lift effect
- Input Fields: Height 48px, border, border-radius 6px, padding 12px 16px, focus state with primary color

### Animation & Interactions
- Timing: Fast 150ms (micro), Medium 300ms (standard), Slow 500ms (complex)
- Common Animations: Fade in, Slide up (TranslateY 20px→0), Scale on hover (1→1.02), Scroll animations with intersection observer

---

## Technical Requirements

### Performance
- Page Load: <3 seconds on 3G
- First Contentful Paint: <1.5 seconds
- Time to Interactive: <3.5 seconds
- Lighthouse Score: >90 (Performance, Accessibility, Best Practices, SEO)

### Code Architecture
- React functional components with hooks
- Tailwind CSS for utility-first styling
- Component code splitting for heavy components
- Context/state management for theme
- Semantic HTML5 elements, proper heading hierarchy

### Accessibility (WCAG 2.1 AA)
- Color contrast 4.5:1 for body text, 3:1 for large text
- Keyboard navigation support (tab order, focus states)
- Alt text for all images
- Aria labels for interactive elements
- Screen reader friendly

### SEO Requirements
- Meta Tags: Title (50-60 chars), Description (150-160 chars), Open Graph/Twitter Card tags
- Structured Data: JSON-LD schema for Organization, Product, FAQPage
- Proper H1-H6 hierarchy, XML sitemap

---

## Content Guidelines & Copywriting

### Voice & Tone
- Professional but approachable
- Confident, not arrogant
- Clear and concise
- Benefit-focused
- Data-driven

### Copywriting Principles
1. Lead with benefits, not features ("Close deals 40% faster" before "AI-powered lead scoring")
2. Use specific numbers ("Save 10 hours per week" not "save time")
3. Address objections preemptively (security, integration, ROI)
4. Use power words: Transform, accelerate, eliminate, automate, optimize, streamline
5. Show, don't tell (use case studies, concrete examples)

### Example Headlines
Provide 3-5 headline options tailored to this specific offering based on the avatar and value proposition

---

## Success Metrics

### Primary KPIs
- Demo Request Rate: Target 3-5%
- Free Trial Signups: Target 2-4%
- Time on Page: Target 3+ minutes
- Bounce Rate: Target <40%
- Scroll Depth: Target 60%+ reach final CTA

---

**IMPORTANT**: Make this PRD immediately actionable for Cursor/Windsurf AI tools and human developers. Include exact measurements, behaviors, and specifications. The output should be 3000-5000 words with comprehensive detail in every section."""

        # Build context
        avatar_text = json.dumps(problem_aware_avatar, indent=2)
        brand_text = json.dumps(brand_identity, indent=2)
        diary_text = json.dumps(diary_entries, indent=2)
        offer_text = json.dumps(offer_context, indent=2)

        user_prompt = f"""Create a complete landing page specification (PRD) based on:

PROBLEM AWARE AVATAR:
{avatar_text}

BRAND IDENTITY:
{brand_text}

CUSTOMER JOURNEY DIARY:
{diary_text}

OFFER CONTEXT:
{offer_text}

Generate the complete 17-section landing page specification. Make it specific, actionable, and conversion-focused."""

        # Call OpenAI
        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=8000  # Comprehensive landing page PRD (3000-5000 words)
        )

        landing_page_spec = result["content"]

        return {
            "success": True,
            "landing_page_spec": landing_page_spec,
            "tokens_used": result.get("tokens_used")
        }

    except Exception as e:
        import traceback
        print(f"Error in generate_landing_page_spec: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate landing page spec: {str(e)}")


@app.post("/api/ai/generate-marketing-assets")
async def generate_marketing_assets(request: Dict[str, Any]):
    """
    Generate 100+ marketing assets kit

    Creates headlines, emails, social posts, ad copy, video scripts, content ideas,
    lead magnets, and more based on all previous research
    """

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        problem_aware_avatar = request.get('problem_aware_avatar', {})
        brand_identity = request.get('brand_identity', {})
        diary_entries = request.get('diary_entries', {})
        offer_context = request.get('offer_context', {})
        landing_page_spec = request.get('landing_page_spec', '')

        system_prompt = """You are a master copywriter and marketing strategist with expertise in Eugene Schwartz's "Breakthrough Advertising" principles.

Your mission: Create a COMPLETE marketing assets kit (100+ items) for this offer targeting the Problem Aware audience.

Return a comprehensive JSON object with the following structure:

{
  "headlines": {
    "curiosity": ["headline 1", "headline 2", "headline 3", "headline 4", "headline 5"],
    "benefit_driven": ["headline 1", "headline 2", "headline 3", "headline 4", "headline 5"],
    "problem_agitation": ["headline 1", "headline 2", "headline 3", "headline 4", "headline 5"],
    "social_proof": ["headline 1", "headline 2", "headline 3", "headline 4", "headline 5"]
  },
  "email_sequences": {
    "welcome_sequence": ["email 1", "email 2", "email 3", "email 4", "email 5"],
    "nurture_sequence": ["email 1", "email 2", "email 3", "email 4", "email 5"],
    "sales_sequence": ["email 1", "email 2", "email 3", "email 4", "email 5"]
  },
  "social_posts": {
    "instagram": ["post 1", "post 2", "post 3", "post 4", "post 5", "post 6", "post 7", "post 8", "post 9", "post 10"],
    "twitter": ["post 1", "post 2", "post 3", "post 4", "post 5", "post 6", "post 7", "post 8", "post 9", "post 10"],
    "linkedin": ["post 1", "post 2", "post 3", "post 4", "post 5", "post 6", "post 7", "post 8", "post 9", "post 10"]
  },
  "ad_copy": {
    "facebook_ads": ["ad 1", "ad 2", "ad 3", "ad 4", "ad 5"],
    "google_ads": ["ad 1", "ad 2", "ad 3", "ad 4", "ad 5"]
  },
  "video_scripts": ["script 1", "script 2", "script 3", "script 4", "script 5"],
  "content_pillars": {
    "pillar_1": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"],
    "pillar_2": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"],
    "pillar_3": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"]
  },
  "lead_magnets": ["magnet 1", "magnet 2", "magnet 3", "magnet 4", "magnet 5"],
  "tripwire_offers": ["offer 1", "offer 2", "offer 3"],
  "webinar_outline": "Complete webinar structure",
  "launch_campaign": {
    "pre_launch": ["activity 1", "activity 2", "activity 3"],
    "launch": ["activity 1", "activity 2", "activity 3"],
    "post_launch": ["activity 1", "activity 2", "activity 3"]
  }
}

Make every asset ready-to-use and conversion-focused."""

        # Build context
        avatar_text = json.dumps(problem_aware_avatar, indent=2)
        brand_text = json.dumps(brand_identity, indent=2)
        diary_text = json.dumps(diary_entries, indent=2)
        offer_text = json.dumps(offer_context, indent=2)

        user_prompt = f"""Create the complete marketing assets kit (100+ items) based on:

PROBLEM AWARE AVATAR:
{avatar_text}

BRAND IDENTITY:
{brand_text}

CUSTOMER JOURNEY DIARY:
{diary_text}

OFFER CONTEXT:
{offer_text}

LANDING PAGE SPEC (optional context):
{landing_page_spec[:500] if landing_page_spec else 'Not provided'}

Generate all marketing assets as specified. Make them specific, actionable, and ready to use."""

        # Call OpenAI
        ai = get_ai_provider()
        result = ai.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,  # Higher temperature for creative marketing copy
            response_format={"type": "json_object"},
            max_tokens=4000  # Marketing assets are extensive
        )

        marketing_assets = json.loads(result["content"])

        return {
            "success": True,
            "marketing_assets": marketing_assets,
            "tokens_used": result.get("tokens_used")
        }

    except Exception as e:
        import traceback
        print(f"Error in generate_marketing_assets: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to generate marketing assets: {str(e)}")


@app.get("/api/ai/avatar-prompts")
async def get_avatar_prompts():
    """
    Get the default system prompts for avatar generation
    Frontend can display these and allow users to edit them
    """

    return {
        "success": True,
        "prompts": {
            "avatar_generation": {
                "id": "avatar_generation",
                "name": "Avatar Generation Prompt",
                "description": "System prompt for generating customer avatars from questionnaire responses",
                "default_prompt": """You are a master copywriter and customer psychology expert specializing in Eugene Schwartz's 5 Stages of Market Awareness.

Your task is to create a DETAILED, VIVID customer avatar for someone at a specific stage of awareness.

This avatar should be:
- Deeply human and relatable
- Based on the questionnaire responses provided
- Psychologically accurate for their awareness stage
- Useful for crafting marketing messages and book content

Return a comprehensive JSON object with demographics, psychographics, pain points, goals, buying behavior, awareness context, and a day-in-the-life narrative."""
            },
            "diary_before": {
                "id": "diary_before",
                "name": "Diary Entry - Before",
                "description": "System prompt for generating 'before' diary entries",
                "default_prompt": """You are a creative writer specializing in emotional, first-person narrative.

Write a DIARY ENTRY from the perspective of the customer avatar BEFORE they discovered the solution.

This should be raw and emotional, showing their struggles and frustrations. 300-400 words."""
            },
            "diary_during": {
                "id": "diary_during",
                "name": "Diary Entry - During",
                "description": "System prompt for generating 'during' diary entries",
                "default_prompt": """You are a creative writer specializing in emotional, first-person narrative.

Write a DIARY ENTRY from the perspective of the customer avatar DURING their transformation.

Show both challenges and breakthroughs. 300-400 words."""
            },
            "diary_after": {
                "id": "diary_after",
                "name": "Diary Entry - After",
                "description": "System prompt for generating 'after' diary entries",
                "default_prompt": """You are a creative writer specializing in emotional, first-person narrative.

Write a DIARY ENTRY from the perspective of the customer avatar AFTER their successful transformation.

Show genuine transformation and hope for the future. 300-400 words."""
            }
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

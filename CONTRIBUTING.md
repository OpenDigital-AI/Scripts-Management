# Contributing to Logon Demo - Cloudbase

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/logondemo-cloudbase.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment:
   ```bash
   cp .env.example .env
   # Add your Cloudbase environment ID
   ```

3. Run in development mode:
   ```bash
   npm run electron:dev
   ```

## Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Follow Vue 3 Composition API best practices
- Keep components focused and reusable

## Testing

Before submitting a PR:

1. Ensure the app builds: `npm run build`
2. Test the Electron app: `npm run electron:dev`
3. Check for console errors
4. Test all authentication flows

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update documentation for any new features
3. The PR will be merged once reviewed and approved

## Reporting Bugs

When reporting bugs, please include:

- Operating system and version
- Node.js version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

## Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists
- Describe the feature clearly
- Explain the use case
- Provide examples if possible

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing! 🎉

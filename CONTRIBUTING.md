# Contributing to 脚本集成管理系统 v0.1

感谢您对本项目的关注！本文档提供贡献指南。

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/logondemo-cloudbase.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Tencent Cloudbase account

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your Cloudbase environment ID:
   # VITE_CLOUDBASE_ENV=your-environment-id
   ```

3. Configure Cloudbase:
   - Create a Cloudbase environment at https://console.cloud.tencent.com/tcb
   - Enable authentication methods (Anonymous, Username/Password)
   - Create `resource259` collection in database
   - Update `.env` with your environment ID

4. Run in development mode:
   ```bash
   npm run electron:dev
   ```
   This will start Vite dev server on port 5173 and launch Electron app.

## Project Structure Understanding

Before contributing, familiarize yourself with:

- **electron/main.js** - Main process, IPC handlers, config loading, menu system
- **src/views/Home.vue** - Main UI with sidebar, search, file operations (1397 lines)
- **src/views/Login.vue** - Authentication UI (421 lines)
- **src/services/cloudbase.js** - Cloudbase SDK wrapper (352 lines)
- **src/utils/validation.js** - Input validation and security (200 lines)
- **config.json** - External configuration for production builds

## Code Style

### General Guidelines
- Use 2 spaces for indentation
- Use semicolons in JavaScript
- Use single quotes for strings
- Follow Vue 3 Composition API best practices
- Keep components focused and reusable
- Write descriptive comments for complex logic

### Vue Components
- Use Composition API (ref, computed, watch)
- Place script setup at top, template in middle, style at bottom
- Use descriptive variable names (e.g., `filteredMenuItems` not `items`)
- Prefer computed properties over methods for derived state

### Chinese Localization
- All user-facing text must be in Chinese
- Error messages should be in Chinese
- Menu items, labels, buttons in Chinese
- Code comments can be in English

## Testing Checklist

Before submitting a PR:

### Build & Run Tests
1. ✅ Clean build: `npm run build`
2. ✅ Electron dev mode: `npm run electron:dev`
3. ✅ Production build: `npm run electron:build`
4. ✅ Check console for errors/warnings

### Functionality Tests
1. ✅ Login flows (匿名登录 and 账号密码)
2. ✅ Script list loading from database
3. ✅ Search functionality (filter scripts)
4. ✅ File operations:
   - Create folder with date stamp
   - Download files from downloadlink
   - Download files from rawdatalink
   - Handle duplicate filenames correctly
5. ✅ Status messages display correctly (three separate boxes)
6. ✅ HK time clock updates every second
7. ✅ Logout functionality
8. ✅ Config.json loading (in production build)

### Security Tests
1. ✅ Input validation working (email, password)
2. ✅ XSS protection (test with `<script>` tags)
3. ✅ Password strength indicator
4. ✅ Generic error messages (no credential leakage)

### UI/UX Tests
1. ✅ Chinese text displays correctly
2. ✅ Icons render (🐍 Python snake)
3. ✅ Blue gradient backgrounds
4. ✅ Responsive layout
5. ✅ Search box real-time filtering

### UI/UX Tests
1. ✅ Chinese text displays correctly
2. ✅ Icons render (🐍 Python snake)
3. ✅ Blue gradient backgrounds
4. ✅ Responsive layout
5. ✅ Search box real-time filtering

## Pull Request Process

### Before Submitting
1. Update README.md if you've added features or changed functionality
2. Update ARCHITECTURE.md for architectural changes
3. Ensure all tests pass (see Testing Checklist above)
4. Update package.json version if applicable
5. Add/update comments for complex code

### PR Description Should Include
- **What**: Clear description of what was changed
- **Why**: Reason for the change
- **How**: Brief explanation of implementation approach
- **Testing**: What tests were performed
- **Screenshots**: For UI changes (before/after)

### Review Process
1. PRs will be reviewed by maintainers
2. Address feedback and requested changes
3. Once approved, the PR will be merged
4. Follow-up issues may be created for future improvements

## Reporting Bugs

### Bug Report Template

When reporting bugs, please include:

**Environment**
- Operating System: (e.g., Windows 10, macOS 13)
- Node.js version: `node --version`
- Electron version: (check package.json)
- App version: v0.1

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots/Logs**
- Attach screenshots if applicable
- Include console errors (F12 → Console)
- Attach electron main process logs if relevant

**Additional Context**
- Cloudbase environment ID (if relevant)
- Database collection structure (if relevant)
- Network conditions (if download-related)

## Feature Requests

We welcome feature requests! Please:

1. **Check Existing Issues**: Search for similar requests first
2. **Describe Clearly**: What feature do you want?
3. **Explain Use Case**: Why is this feature needed?
4. **Provide Examples**: Mock-ups, screenshots, or similar apps
5. **Consider Scope**: Is it aligned with project goals?

### Feature Ideas Welcome
- Additional file operations
- Enhanced search capabilities
- Export/import functionality
- Batch operations
- Additional Cloudbase integrations
- Performance improvements
- Accessibility enhancements

## Development Guidelines

### Adding New Features

1. **Plan First**: Discuss in an issue before coding
2. **Keep It Modular**: Create reusable components/services
3. **Follow Patterns**: Use existing code patterns
4. **Maintain Security**: Use validation.js for all inputs
5. **Chinese First**: All UI text in Chinese

### Modifying Existing Features

1. **Understand Context**: Read related code and comments
2. **Test Thoroughly**: Test old and new behavior
3. **Backward Compatibility**: Don't break existing workflows
4. **Update Docs**: Keep documentation in sync

### Working with Cloudbase

- All database operations through `cloudbase.js` service
- Use `getTempFileURLs()` for cloud storage files
- Handle authentication states properly
- Test with real Cloudbase environment
- Don't hardcode environment IDs (use config.json)

### Security Considerations

- **Always validate inputs**: Use `validation.js` utilities
- **Sanitize user data**: Call `sanitizeInput()` before display
- **Generic errors**: Don't leak sensitive info in error messages
- **Test XSS**: Try injecting `<script>` tags
- **Secure IPC**: Only expose necessary APIs in preload.js

## Code Review Checklist

Reviewers will check for:

- [ ] Code follows project style guide
- [ ] All user-facing text is in Chinese
- [ ] Input validation is implemented
- [ ] No hardcoded credentials or environment IDs
- [ ] Error handling is robust
- [ ] Console logs are appropriate (not excessive)
- [ ] Comments explain complex logic
- [ ] No breaking changes (or documented)
- [ ] Performance impact is acceptable
- [ ] Security best practices followed

## Code of Conduct

### Our Standards

- **Be Respectful**: Treat everyone with respect
- **Be Inclusive**: Welcome diverse perspectives
- **Be Constructive**: Provide helpful feedback
- **Be Professional**: Focus on code, not people
- **Be Patient**: Remember everyone is learning

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information
- Any conduct that would be inappropriate professionally

## Getting Help

### Resources

- **Documentation**: Check README.md and ARCHITECTURE.md
- **Issues**: Search existing issues for similar problems
- **Discussions**: Use GitHub Discussions for questions
- **Cloudbase Docs**: https://cloud.tencent.com/document/product/876

### Common Questions

**Q: How do I change the Cloudbase environment?**  
A: Edit `config.json` for production builds, or `.env` for development.

**Q: Where do I add new menu items?**  
A: In `electron/main.js`, update the `createMenu()` function.

**Q: How do I add a new database field?**  
A: Update the collection in Cloudbase console, then modify `Home.vue` to display it.

**Q: Why are my downloads failing with 403?**  
A: Ensure you're using `cloud://` file IDs and calling `getTempFileURLs()` before downloading.

**Q: How do I test the production build locally?**  
A: Run `npm run electron:build`, then execute `dist-electron/win-unpacked/脚本集成管理系统.exe`.

## Thank You!

Thank you for contributing to 脚本集成管理系统! 🎉

Your contributions help make this project better for everyone.

---

**Project**: 脚本集成管理系统 v0.1  
**Maintainer**: OpenDigital-AI  
**Last Updated**: 2025-12-25

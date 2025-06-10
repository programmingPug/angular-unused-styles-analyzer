# Angular Unused Styles Analyzer

A Visual Studio Code extension that automatically detects and highlights unused CSS/SCSS styles in Angular components. Keep your stylesheets clean and optimized by identifying dead code in real-time.

## Features

✨ **Real-time Analysis** - Automatically analyzes styles as you type
🔍 **Multi-file Detection** - Scans HTML templates, TypeScript components, and stylesheets
🎯 **Angular-aware** - Understands Angular-specific patterns like `[class.myClass]`, `[ngClass]`, and `@HostBinding`
⚡ **Performance Optimized** - Lightweight analysis that won't slow down your development
🎨 **SCSS Support** - Works with both CSS and SCSS files
🚫 **Smart Ignoring** - Configurable ignored selectors (`:host`, `::ng-deep`, etc.)

## How It Works

The extension analyzes your Angular component files in three steps:

1. **Extracts CSS selectors** from your `.component.scss` or `.component.css` files
2. **Scans for usage** in your `.component.html` templates and `.component.ts` files
3. **Highlights unused styles** with warning diagnostics directly in your editor

### Supported Usage Patterns

**HTML Template Detection:**
- `class="my-class another-class"`
- `id="my-element"`
- `[class.dynamic-class]="condition"`
- `[ngClass]="classObject"`

**TypeScript Component Detection:**
- `renderer.addClass(element, 'my-class')`
- `element.classList.add('my-class')`
- `@HostBinding('class.my-class')`
- String literals that look like CSS classes

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Angular Unused Styles Analyzer"
4. Click Install

### From Command Line
```bash
code --install-extension programmingPug.angular-unused-styles-analyzer
```

## Usage

### Automatic Analysis
The extension automatically analyzes your Angular component styles when you:
- Open a `.component.scss` or `.component.css` file
- Make changes to component files
- Save files (if enabled in settings)

### Manual Analysis
- **Single Component**: Right-click on a style file → "Angular: Analyze Unused Styles"
- **Entire Workspace**: `Ctrl+Shift+P` → "Angular: Analyze Entire Workspace"

### Visual Indicators
Unused styles are marked with:
- 🔸 Yellow warning squiggles under the selector
- 💡 Hover tooltip explaining why the style appears unused

## Configuration

Configure the extension through VS Code settings (`Ctrl+,`):

```json
{
  "angularUnusedStyles.enableRealTimeanalysis": true,
  "angularUnusedStyles.analyzeOnSave": true,
  "angularUnusedStyles.showInformationMessages": true,
  "angularUnusedStyles.ignoredSelectors": [
    "::ng-deep",
    ":host",
    ":host-context",
    ":host(.*)"
  ]
}
```

### Settings Reference

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enableRealTimeanalysis` | boolean | `true` | Enable real-time analysis as you type |
| `analyzeOnSave` | boolean | `true` | Automatically analyze when files are saved |
| `showInformationMessages` | boolean | `true` | Show completion messages after analysis |
| `ignoredSelectors` | array | See above | CSS selectors to ignore (supports regex) |

## Examples

### Before (Unused Styles Highlighted)
```scss
.used-class {
  color: blue;
}

.unused-class {  // ⚠️ Warning: appears to be unused
  color: red;
}

:host {  // ✅ Ignored (in default config)
  display: block;
}
```

### Component Usage Detection
```typescript
// TypeScript - These classes will be detected as "used"
@Component({...})
export class MyComponent {
  @HostBinding('class.dynamic-class') isDynamic = true;
  
  toggleClass() {
    this.renderer.addClass(this.elementRef.nativeElement, 'added-class');
  }
}
```

```html
<!-- HTML Template - These classes will be detected as "used" -->
<div class="used-class" [class.dynamic-class]="condition">
  <span [ngClass]="{'conditional-class': isActive}">Content</span>
</div>
```

## Limitations

- **Dynamic class names**: Classes built from variables or complex expressions may not be detected
- **Third-party libraries**: Styles used by external components may appear unused
- **Complex selectors**: Very complex CSS selectors might have edge cases
- **Build-time classes**: Classes added by build tools or preprocessors may not be detected

## Troubleshooting

### False Positives
If valid styles are marked as unused:

1. **Check dynamic usage**: The style might be applied via TypeScript code
2. **Review ignored selectors**: Add patterns to the `ignoredSelectors` setting
3. **Verify file structure**: Ensure component files follow Angular naming conventions

### Extension Not Working
1. **Check file extensions**: Only works with `.component.scss` and `.component.css` files
2. **Verify Angular project**: Extension is designed for Angular component architecture
3. **Restart VS Code**: Sometimes needed after changing settings

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
```bash
git clone https://github.com/programmingPug/angular-unused-styles-analyzer.git
cd angular-unused-styles-analyzer
npm install
npm run compile
```

### Testing
- Press `F5` in VS Code to launch the Extension Development Host
- Open an Angular project in the new window to test the extension

## Release Notes

### 1.0.0
- Initial release
- Real-time unused style detection
- Support for CSS and SCSS files
- Angular-specific pattern recognition
- Configurable ignored selectors
- Context menu integration

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Report bugs**: [GitHub Issues](https://github.com/programmingPug/angular-unused-styles-analyzer/issues)
- 💡 **Feature requests**: [GitHub Issues](https://github.com/programmingPug/angular-unused-styles-analyzer/issues)
- 📧 **Email**: ckoch@lazypug.net

---

**Happy coding!** 🐶💻

Made with ❤️ by [Christopher Koch](https://github.com/programmingPug)
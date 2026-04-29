
---

## Related resources

- [**Best-of.org**](https://best-of.org): More ranked lists of open-source projects across many topics.

## Contribution

Contributions are encouraged. You can:

- Use the [issue templates](https://github.com/merovinh/best-of-algorithmic-trading/issues/new/choose) to propose additions or corrections.
- Edit [`projects.yaml`](https://github.com/merovinh/best-of-algorithmic-trading/blob/main/projects.yaml) and open a pull request (or use the [GitHub web editor](https://github.com/merovinh/best-of-algorithmic-trading/edit/main/projects.yaml)).

Metadata and markdown generation use the [best-of-generator](https://github.com/best-of-lists/best-of-generator) family of tools. Guidelines: [CONTRIBUTING.md](https://github.com/merovinh/best-of-algorithmic-trading/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/merovinh/best-of-algorithmic-trading/blob/main/.github/CODE_OF_CONDUCT.md).

### For maintainers (TypeScript checks)

This repo includes a small **TypeScript** validator for `projects.yaml` (schema, categories, labels, duplicate IDs). After cloning:

```bash
npm install
npm run check   # compile + validate projects.yaml
```

CI runs the same check on relevant changes. Fixing validation errors before merging keeps the list consistent.

## License

[![CC BY-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

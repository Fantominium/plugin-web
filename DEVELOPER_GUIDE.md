# Quick Reference: TDD Implementation Guide

## Overview
This project is being built using TDD (Test-Driven Development). Write tests FIRST, then implement.

## Quick Start

### Running Tests
```bash
npm test                    # Run all tests
npm test:watch             # Watch mode
npm test:coverage          # With coverage
npm test -- --testNamePattern="CategoryFilter"  # Specific test
```

### File Structure for New Features

**Service (API layer):**
```
app/lib/
├── my-feature-service.ts       # Implementation
└── __tests__/
    └── my-feature-service.test.ts  # Tests
```

**Component:**
```
app/components/
├── MyComponent/
│   ├── MyComponent.tsx        # Implementation
│   ├── MyComponent.module.css # Styles
│   └── __tests__/
│       └── MyComponent.test.tsx   # Tests
```

---

## TDD Pattern

### 1. Write Tests First
```typescript
describe('MyService', () => {
  it('should do something', async () => {
    const result = await myFunction('input');
    expect(result).toBe('expected');
  });
});
```

### 2. Run Tests (They'll fail)
```bash
npm test -- MyService.test.ts
```

### 3. Implement to Pass Tests
```typescript
export function myFunction(input: string) {
  return 'expected';
}
```

### 4. Verify All Tests Pass
```bash
npm test
```

---

## Common Testing Patterns

### Testing Services
```typescript
it('should fetch data', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'value' })
  });
  
  const result = await myService();
  expect(result).toBeDefined();
});
```

### Testing Components
```typescript
it('should render button', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button', { name: /click/i });
  expect(button).toBeInTheDocument();
});

it('should call onClick', async () => {
  const onClick = jest.fn();
  render(<MyComponent onClick={onClick} />);
  await userEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});
```

### Testing Async Components
```typescript
it('should load data', async () => {
  render(<Component />);
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('loaded')).toBeInTheDocument();
  });
});
```

---

## Current Services API

### event-service.ts
```typescript
fetchEventById(id)              // Get single event
fetchEventList(options)         // List with pagination
fetchEventsByCategory(cat)      // Filter by category
fetchEventsByDateRange(from, to) // Filter by date
fetchEventsByLocation(loc, opts) // Filter by location
fetchEventsByMultipleFilters(filters) // Combined filters
```

### search-service.ts
```typescript
searchEvents(keyword, filters)  // Debounced search (250ms)
getSearchSuggestions(keyword)   // Auto-complete
saveSearchToHistory(term)       // Save to localStorage
getSearchHistory()              // Retrieve history
clearSearchHistory()            // Clear all
```

### auth-service.ts
```typescript
login(email, password)          // Login
signup(email, password, name)   // Register
logout()                        // Logout
refreshToken()                  // Auto-refresh
getCurrentUser()                // Get user data
isAuthenticatedAsync()          // Check auth
validateToken(token)            // Validate
getStoredToken()                // Get token
```

---

## Adding a New Filter Component

### 1. Create Test File
```typescript
// app/components/EventFilters/__tests__/MyFilter.test.tsx
describe('MyFilter', () => {
  it('should render', () => {
    render(<MyFilter onChange={jest.fn()} />);
    expect(screen.getByLabelText(/mylabel/i)).toBeInTheDocument();
  });
});
```

### 2. Create Component
```typescript
// app/components/EventFilters/MyFilter.tsx
export default function MyFilter({ onChange }) {
  return (
    <div>
      <label htmlFor="my-filter">My Label</label>
      <input id="my-filter" onChange={e => onChange(e.target.value)} />
    </div>
  );
}
```

### 3. Run Tests
```bash
npm test -- MyFilter.test.tsx
```

---

## Git Workflow

1. Create feature branch
2. Write tests
3. Implement code
4. Ensure all tests pass: `npm test`
5. Commit with message: "feat: Add MyFeature (15 tests)"
6. Push and create PR

---

## Important Notes

### Types
- Always define types in `app/types/`
- Use strict TypeScript
- Export interfaces publicly

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Error Handling
- Graceful fallbacks for API errors
- User-friendly error messages
- Log errors to console
- Don't expose sensitive data

### Performance
- Debounce search (250ms)
- Lazy load images
- Memoize callbacks
- Avoid unnecessary re-renders

---

## Troubleshooting

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Specific Test Hanging
- Check for `await` missing
- Ensure mocks are cleared: `jest.clearAllMocks()`
- Check for infinite loops

### TypeScript Errors
- Check `tsconfig.json`
- Ensure types are exported
- Use `as const` for literals

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## Sprint Status

- **Sprint 1:** ✅ Complete (15 + 20 + 27 = 62 tests)
- **Sprint 2:** 🟡 In Progress (14/40 tests complete)
- **Sprint 3:** ⏱️ Pending
- **Sprint 4-8:** 📋 Planned

---

## Contact & Questions

For issues or questions about implementation, refer to IMPLEMENTATION_PROGRESS.md for detailed status and next steps.

# Pull Request Gate Review

## Summary

- [ ] Change summary added
- [ ] Risky areas called out
- [ ] Rollback or forward-fix note added if needed

## Constitution Gate Matrix

Mark every applicable gate as `PASS`, `FAIL`, or `N/A`.
Missing evidence is `FAIL`.

| Gate | Status | Evidence / Notes |
| ---- | ------ | ---------------- |
| P1 Clean Scope | [ ] PASS [ ] FAIL [ ] N/A | |
| P2 Formatting and Lint | [ ] PASS [ ] FAIL [ ] N/A | |
| P3 Type Safety | [ ] PASS [ ] FAIL [ ] N/A | |
| P4 Unit Tests | [ ] PASS [ ] FAIL [ ] N/A | |
| P5 Integration Tests | [ ] PASS [ ] FAIL [ ] N/A | |
| P6 End-to-End Tests | [ ] PASS [ ] FAIL [ ] N/A | |
| P7 Regression Tests | [ ] PASS [ ] FAIL [ ] N/A | |
| P8 Accessibility | [ ] PASS [ ] FAIL [ ] N/A | |
| P9 SonarQube | [ ] PASS [ ] FAIL [ ] N/A | |
| P10 API Contract | [ ] PASS [ ] FAIL [ ] N/A | |
| P11 Postgres Migration | [ ] PASS [ ] FAIL [ ] N/A | |
| P12 Authorization | [ ] PASS [ ] FAIL [ ] N/A | |
| P13 Caching | [ ] PASS [ ] FAIL [ ] N/A | |
| P14 Container Security | [ ] PASS [ ] FAIL [ ] N/A | |
| P15 Network Security | [ ] PASS [ ] FAIL [ ] N/A | |

## Scope Classification

- [ ] User-facing UI / accessibility
- [ ] Business logic
- [ ] API contract
- [ ] Authentication / authorization
- [ ] Database / migrations
- [ ] Caching
- [ ] Container / deployment
- [ ] Network security
- [ ] Performance-sensitive change

## Evidence Checklist

- [ ] Unit test evidence linked
- [ ] Integration test evidence linked
- [ ] End-to-end evidence linked or marked N/A
- [ ] Regression coverage linked or marked N/A
- [ ] Accessibility automation and manual verification linked or marked N/A
- [ ] Contract validation linked or marked N/A
- [ ] Migration validation linked or marked N/A
- [ ] SonarQube result linked or marked N/A

### Manual Accessibility Evidence

- [ ] Keyboard-only walkthrough completed for sign-in success path
- [ ] Keyboard-only walkthrough completed for provider-failure recovery path
- [ ] Keyboard-only walkthrough completed for magic-link rate-limit denial path
- [ ] Keyboard-only walkthrough completed for unauthenticated redirect path
- [ ] Keyboard-only walkthrough completed for unauthorized page path
- [ ] Screen-reader announcement verified for login inline error (`role="alert"`)

Manual notes (include browser, assistive technology, and any deviations):

```
[Example] Chrome 124 + VoiceOver macOS 14; all focus targets visible; no traps.
```

## Exceptions

- [ ] No constitution exceptions requested
- [ ] Exception documented with owner, expiry, compensating controls, and follow-up issue

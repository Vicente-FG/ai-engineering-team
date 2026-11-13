# Accessibility and Internationalization

Rules for inclusive interfaces and correct localization. Entry format: ID, one-line instruction, the source it comes from, and the concrete check to perform.

### WCAG22 | Implement user interfaces against WCAG 2.2 success criteria and record which criteria the change satisfies
- Source: Web Content Accessibility Guidelines (WCAG) 2.2
- URL: https://www.w3.org/TR/WCAG22/
- Authority: the W3C Recommendation itself, the normative accessibility standard referenced by regulation and procurement
- Version/date: W3C Recommendation 12 December 2024 (version 2024-12-12)
- Verified on: 2026-11-05
- Apply when: building or reviewing any user-facing component — check the applicable Level A/AA success criteria, including the WCAG 2.2 additions (focus not obscured, target size, dragging movements, consistent help)

### ARIA-APG | Implement custom widgets following the ARIA Authoring Practices patterns instead of inventing roles, states and keyboard behaviour
- Source: ARIA Authoring Practices Guide (W3C WAI)
- URL: https://www.w3.org/WAI/ARIA/apg/
- Authority: the W3C WAI guidance that documents the expected keyboard interaction and ARIA semantics for common widget patterns
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: building a custom control (menu, dialog, combobox, tabs) — confirm it matches the APG pattern for keyboard interaction and that `aria-expanded`, `aria-selected`, `aria-controls` and focus management are correct

### A11Y-EVALUATE | Combine automated checks with manual and expert review, because no tool alone can prove a page is accessible
- Source: Evaluating Web Accessibility (W3C WAI)
- URL: https://www.w3.org/WAI/test-evaluate/
- Authority: W3C WAI's guidance on accessibility evaluation, stating explicitly that "no tool alone can determine if a site meets accessibility standards" and that knowledgeable human evaluation is required
- Version/date: updated 12 August 2026
- Verified on: 2026-11-05
- Apply when: signing off an accessibility review — confirm the automated scan was run AND a keyboard/screen-reader pass was performed by a person; never close an a11y ticket on scanner output alone

### AXE-CORE | Run axe-core in CI as a baseline automated check on every page or component
- Source: axe-core (GitHub repository)
- URL: https://github.com/dequelabs/axe-core
- Authority: Deque's reference accessibility testing engine, the engine embedded in the major browsers and audit tools
- Version/date: repository page as fetched; 7,764 stars observed on the repo page
- Verified on: 2026-11-05
- Apply when: adding a page or component — confirm an axe-core scan runs in CI and that new violations fail the build; treat a clean scan as necessary, not sufficient

### CLDR-PLURAL | Compute plural forms and number/date formats with CLDR data rather than hand-written `if (n === 1)` logic
- Source: Plural Rules (Unicode CLDR Specification)
- URL: https://cldr.unicode.org/index/cldr-spec/plural-rules
- Authority: the Unicode CLDR specification, the authoritative source of plural categories and locale data used by ICU, browsers and `Intl`
- Version/date: date not stated on the page as fetched
- Verified on: 2026-11-05
- Apply when: localizing any string containing a count — use the runtime's plural rules (`Intl.PluralRules`) and verify the message has the right plural-category keys for every supported locale

### INTL-API | Format dates, numbers, currencies and time zones with the `Intl` API and explicit locale and time zone, never with hand-rolled formatting
- Source: Intl (MDN Web Docs)
- URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- Authority: MDN's reference for the ECMA-402 internationalization API, which is the platform's normative locale-aware formatting surface
- Version/date: date not stated
- Verified on: 2026-11-05
- Apply when: displaying any date, number or currency — confirm `Intl.DateTimeFormat`/`Intl.NumberFormat` is used with an explicit `locale` and `timeZone`, and that no string concatenation formats raw values

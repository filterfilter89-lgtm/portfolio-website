# USER PORTFOLIO SPECIFICATION & STRICT DIRECTIVES

## PRIMARY PORTFOLIO LOCATION
The user's authentic portfolio website is strictly and exclusively located at:
`C:\Users\basil\Documents\WEBSITE PORTFOLIO`

---

## IRONCLAD COMMANDMENTS (MANDATORY FOR ALL AGENTS)

### 1. ZERO BLANK SCREEN GUARANTEE
- Under NO circumstance should any request result in a blank page, white screen of death, or unhandled runtime crash.
- React ErrorBoundary must wrap the root app to catch unexpected errors and prevent tree unmounting.
- Before concluding any task, the agent MUST run verification to guarantee the site builds cleanly (`npm run build`) and renders real DOM content without uncaught errors.

### 2. STRICT SCOPE DISCIPLINE (ZERO EXTRA / ZERO MISSING)
- **"Other than the said change, nothing extra should be added or removed."**
- Modify ONLY the exact lines, components, or styles necessary to fulfill the user's specific instruction.
- **NEVER** perform unsolicited "refactoring", "cleaning up unused styles", or restructuring existing elements.
- **NEVER** replace full multi-hundred line files with abbreviated, summarized, or truncated snippets.

### 3. SAFE & NON-DESTRUCTIVE EDITS
- Before modifying critical, sensitive files (e.g., `styles.css`, `src/App.jsx`, `src/components/AlbumCarousel.jsx`), create a backup or ensure the edit uses exact surgical string replacements (`replace_file_content` / targeted chunks).
- Never use bulk overwrite (`write_to_file`) on existing production stylesheets or core component files.

### 4. MANDATORY DEV SERVER INTEGRITY
- Dev Server Command: `npm run dev` in `C:\Users\basil\Documents\WEBSITE PORTFOLIO`
- Port: `http://localhost:5173` (network: `http://0.0.0.0:5173`)
- Always verify the server is responding (`HTTP 200 OK`) and the site renders properly.

### 5. FORBIDDEN DIRECTORIES - NEVER OPEN, SERVE, OR EDIT:
- `C:\Users\basil\Documents\Default Project` (FORBIDDEN - Empty placeholder)
- `C:\Users\basil\.gemini\antigravity-ide\scratch\portfolio` (FORBIDDEN - Obsolete scratch placeholder)
- `C:\Users\basil\.gemini\antigravity\scratch\basil-portfolio` (FORBIDDEN - Obsolete scratch directory)
- `C:\Users\basil\.gemini\antigravity\scratch\vinyl-portfolio` (FORBIDDEN - Old template)
- `C:\Users\basil\Documents\website\portfolio` (FORBIDDEN - Old duplicate)

---

## MANDATORY OUTPUT VERIFICATION CHECKLIST
When reporting any work on the portfolio, the agent MUST output the following strict verification table:
| Check | Status | Evidence |
|---|---|---|
| Build Integrity | PASS | `npm run build` exited code 0 |
| Zero Blank Screen | PASS | Rendered DOM verified non-empty |
| Scope Containment | PASS | Only requested lines changed; no extra additions/removals |
| Server Health | PASS | HTTP 200 OK on http://localhost:5173 |

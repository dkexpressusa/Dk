# Working Rules For This Project

## Core policy
- Make the smallest possible change.
- Preserve the current UI, layout, styling, text, spacing, and component structure.
- Do not redesign, refactor, rename files, move files, or split/merge components unless absolutely necessary.
- Do not replace libraries, frameworks, or existing services unless explicitly asked.

## Priority
- First priority is to keep the current visual result unchanged.
- Second priority is to make the project deploy successfully on Vercel.
- Third priority is to fix runtime, API, environment, and integration issues with minimal diff.

## Allowed changes
- Fix build and deployment errors
- Fix import/export issues
- Fix env variable handling for Vercel
- Fix broken API calls or runtime integration issues
- Fix path/alias issues
- Fix image/asset path issues
- Add minimal config only if necessary for deployment

## Readdy-related policy
- Inspect all Readdy-dependent code, API calls, environment variables, assets, and runtime dependencies.
- Keep existing Readdy integrations only if they are required and safe for deployment.
- If a Readdy-dependent part can break on Vercel, explain it clearly and fix it with the smallest possible change.
- Do not remove Readdy-related code unless it is clearly unnecessary or harmful to deployment.

## Execution policy
- First scan the project and identify all files that may affect deployment or runtime.
- Group similar issues and fix them in one pass.
- Prefer minimal diff.
- If a structural change seems necessary, explain why first.

## Output policy
- Show a short diagnosis first.
- Then list the files that need changes and why.
- After edits, summarize exactly what changed and why.
- Confirm whether npm run build succeeds.
- Confirm whether the project is ready for Vercel deployment.


# app/dashboard/content/

Content library and AI-assisted content generation. Campaigns produce social posts, emails, scripts, and other artifacts via templates + LLM, then save / rename / export them.

## Key files

| File | Role |
|------|------|
| `page.tsx` | Route entry |
| `components/ContentPage.tsx` | Top-level layout (My Content + Templates) |
| `components/MyContent.tsx` | User's saved content list |
| `components/TemplatesList.tsx` | Available content templates |
| `components/NewContentFlow.tsx` | Multi-step generation flow (template → input fields → generate) |
| `components/InputFieldsModal.tsx` | Per-template form (dynamic fields) |
| `components/Actions.tsx`, `RenameAction.tsx`, `DeleteAction.tsx`, `TranslateAction.tsx` | Per-item actions |
| `components/ContentTutorial.tsx` (+ `.css`) | First-time-user walkthrough |
| `[slug]/` | Single content item view / editor |

## Patterns

- **Template-driven generation**: each template defines its own input fields (fetched from gp-api). `InputFieldsModal` renders them dynamically — don't hardcode fields per template.
- **Helpers do the AI work**: `helpers/generateAIContent.ts`, `helpers/getAiTemplatesFromCategories.ts`, `helpers/fetchPromptInputFields.ts`, `helpers/getNewAiContentSectionKey.ts`.
- **Action menu** (`components/Actions.tsx`) is composed of self-contained `*Action.tsx` components — pattern matches `outreach/components/OutreachActions.tsx`.

## Gotchas

- `components/ContentTutorial.css` is a rare hand-written CSS file (most styling is Tailwind via design tokens). Don't extend it — prefer Tailwind for new code.
- `[slug]` is the single-item route; editor lives there. Don't add editors at the list-page level.
- Generated content is saved server-side; this UI mostly orchestrates `helpers/generateAIContent.ts` calls.

## Related

- `helpers/generateAIContent.ts`, `helpers/buildAiContentSections.ts`, `helpers/getAiTemplatesFromCategories.ts`.
- `app/dashboard/website/` also generates AI content via the same helpers.

# Directus Collections Setup Guide

Your Directus is running and connected — the 403 just means the collections don't exist yet.
Follow these steps in order at **http://localhost:8055**.

---

## 0. Open the Admin UI

Log in with the credentials from your `docker-compose.yml`:

- **Email:** `admin@example.com`
- **Password:** `change-me`

---

## 1. Create the `technologies` Collection

**Settings → Data Model → Create Collection**

**Collection name:** `technologies`

Add these fields:

| Field name | Interface | Type    | Notes                          |
| ---------- | --------- | ------- | ------------------------------ |
| `name`     | Input     | String  | Required                       |
| `slug`     | Input     | String  | Required + Unique (see below)  |
| `icon`     | Input     | String  | Optional (e.g. emoji or class) |

**Make slug unique:** click `slug` → **Validation** tab → check **Unique**.

Click **Save**.

---

## 2. Create the `projects` Collection

**Settings → Data Model → Create Collection**

**Collection name:** `projects`

Add these fields:

| Field name            | Interface | Type    | Notes                           |
| --------------------- | --------- | ------- | ------------------------------- |
| `title`               | Input     | String  | Required                        |
| `slug`                | Input     | String  | Required + Unique               |
| `subtitle`            | Input     | String  |                                 |
| `description`         | Textarea  | Text    | Required                        |
| `link_code`           | Input     | String  | GitHub / source URL             |
| `link_demo`           | Input     | String  | Live demo URL                   |
| `icon`                | Input     | String  | Emoji, e.g. `🎮`               |
| `featured`            | Toggle    | Boolean | Default: `false`                |
| `client`              | Input     | String  |                                 |
| `location`            | Input     | String  |                                 |
| `service_type`        | Input     | String  |                                 |
| `overview`            | WYSIWYG   | Text    | Rich text — stored as HTML      |
| `process`             | JSON      | JSON    | Array of step strings           |
| `results`             | JSON      | JSON    | Array of `{label, value}`       |
| `testimonial_content` | Textarea  | Text    |                                 |
| `testimonial_author`  | Input     | String  |                                 |
| `testimonial_role`    | Input     | String  |                                 |
| `final_thoughts`      | Textarea  | Text    |                                 |
| `image`               | Image     | UUID    | Stores a Directus file ref      |

Click **Save**.

---

## 3. Create the M2M Relationship: `projects` ↔ `technologies`

Still on the `projects` collection, click **Create Field** → choose **Many to Many**.

- **Related Collection:** `technologies`
- **Field name on projects:** `tech`
- Accept the auto-generated junction table (`projects_technologies`).

Click **Save**.

---

## 4. Create the `home` Singleton Collection

**Settings → Data Model → Create Collection**

**Collection name:** `home`

> **Before adding fields:** enable the **"Single Item"** toggle in the collection setup
> panel. This makes it a singleton — only one record can ever exist.

### Hero fields

| Field name         | Interface | Type   |
| ------------------ | --------- | ------ |
| `hero_top_text`    | Input     | String |
| `hero_headline`    | Input     | String |
| `hero_subheadline` | Textarea  | Text   |
| `hero_buttons`     | JSON      | JSON   |

`hero_buttons` example:

```json
[
  { "label": "View Projects →", "link": "#projects", "style": "primary" },
  { "label": "Get in Touch",    "link": "#contact",  "style": "outline"  }
]
```

### About fields

| Field name      | Interface | Type   |
| --------------- | --------- | ------ |
| `about_title`   | Input     | String |
| `about_content` | WYSIWYG   | Text   |
| `about_stats`   | JSON      | JSON   |

`about_stats` example:

```json
[
  { "number": "4+",  "label": "Years in Web2"      },
  { "number": "2+",  "label": "Years in Web3"      },
  { "number": "10+", "label": "Projects Shipped"   },
  { "number": "5+",  "label": "Chains Deployed"    }
]
```

### Skills fields

| Field name          | Interface | Type   |
| ------------------- | --------- | ------ |
| `skills_title`      | Input     | String |
| `skills_categories` | JSON      | JSON   |

`skills_categories` example:

```json
[
  { "category": "Blockchain", "items": ["Solidity", "Hardhat", "Foundry", "Ethers.js"] },
  { "category": "Frontend",   "items": ["React", "Next.js", "TypeScript", "TailwindCSS"] },
  { "category": "Backend",    "items": ["Node.js", "Express", "PostgreSQL", "Redis"] }
]
```

### Projects section field

| Field name       | Interface | Type   |
| ---------------- | --------- | ------ |
| `projects_title` | Input     | String |

### Contact fields

| Field name             | Interface | Type   |
| ---------------------- | --------- | ------ |
| `contact_title`        | Input     | String |
| `contact_heading`      | Input     | String |
| `contact_content`      | Textarea  | Text   |
| `contact_email`        | Input     | String |
| `contact_social_links` | JSON      | JSON   |

`contact_social_links` example:

```json
[
  { "platform": "GitHub",    "url": "https://github.com/yourhandle"      },
  { "platform": "Twitter/X", "url": "https://twitter.com/yourhandle"     },
  { "platform": "LinkedIn",  "url": "https://linkedin.com/in/yourhandle" }
]
```

Click **Save**, then go to **Content → home → Create Item**, fill in at least one field,
and click **Save**. (The singleton must have a record before the API returns data.)

---

## 5. Create the `site_settings` Singleton Collection

**Settings → Data Model → Create Collection**

**Collection name:** `site_settings`
Enable **Single Item** toggle.

| Field name    | Interface | Type   |
| ------------- | --------- | ------ |
| `title`       | Input     | String |
| `description` | Textarea  | Text   |
| `logo_text`   | Input     | String |
| `footer_text` | Textarea  | Text   |
| `nav_items`   | JSON      | JSON   |

`nav_items` example:

```json
[
  { "label": "About",    "href": "#about"    },
  { "label": "Skills",   "href": "#skills"   },
  { "label": "Projects", "href": "#projects" },
  { "label": "Contact",  "href": "#contact"  }
]
```

Click **Save**, then create the single record under **Content → site_settings**.

---

## 6. Fix the 403 — Configure Public Access

**Settings → Access Policies → Public**

Set **Read** to **All Access** for each of these:

| Collection        | Read        |
| ----------------- | ----------- |
| `projects`        | All Access  |
| `technologies`    | All Access  |
| `home`            | All Access  |
| `site_settings`   | All Access  |
| `directus_files`  | All Access  |

> `directus_files` is required so image asset URLs (`/assets/<uuid>`) resolve without
> a token for unauthenticated visitors.

---

## 7. (Recommended) Use a Static Token Instead of Public Access

A token is more secure than fully open public access.

1. **Settings → Access Tokens → Create Token**
2. Name: `nextjs-server` | Role: `Administrator` (or a custom read-only role)
3. Copy the token value
4. Add to `.env.local`:

```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=paste-your-token-here
```

With a token set you can restrict Public access and only allow authenticated reads.

---

## 8. Add Your First Project

**Content → projects → Create Item**

Required fields:
- `title`, `slug`, `description`
- `featured: true` to appear on the home page

Optional but useful for the case study page:
- `client`, `location`, `service_type`
- `overview` (WYSIWYG), `process` (JSON), `results` (JSON), `testimonial_*`
- `image` — upload via the image picker; Directus stores it in `/directus/uploads/`

Link technologies:
- Click the `tech` M2M field → **Create Item** → enter a tech name and slug
- Or create technologies first under **Content → technologies**, then link them here

---

## 9. Verify

```bash
# Test public collection read (replace token if using auth)
curl http://localhost:8055/items/home
curl http://localhost:8055/items/projects

# Restart the dev server
npm run dev
```

The home page will now serve live Directus content. If Directus is unreachable the
site falls back to the hardcoded data in `src/data/projects.ts`.

---

## JSON Field Reference

Quick copy-paste reference for all JSON fields.

### `hero_buttons`
```json
[
  { "label": "View Projects →", "link": "#projects", "style": "primary" },
  { "label": "Get in Touch",    "link": "#contact",  "style": "outline"  }
]
```

### `about_stats`
```json
[
  { "number": "4+",  "label": "Years in Web2"    },
  { "number": "2+",  "label": "Years in Web3"    },
  { "number": "10+", "label": "Projects Shipped" },
  { "number": "5+",  "label": "Chains Deployed"  }
]
```

### `skills_categories`
```json
[
  { "category": "Blockchain", "items": ["Solidity", "Hardhat", "Foundry", "Ethers.js", "Wagmi", "IPFS"] },
  { "category": "Frontend",   "items": ["React", "Next.js", "TypeScript", "TailwindCSS", "React Native"] },
  { "category": "Backend",    "items": ["Node.js", "Express", "PostgreSQL", "MongoDB", "Firebase", "Redis"] }
]
```

### `contact_social_links`
```json
[
  { "platform": "GitHub",    "url": "https://github.com/yourhandle"      },
  { "platform": "Twitter/X", "url": "https://twitter.com/yourhandle"     },
  { "platform": "LinkedIn",  "url": "https://linkedin.com/in/yourhandle" }
]
```

### `process` (on a project)
```json
[
  "Mapping client journeys to identify weak engagement points.",
  "Building automated feedback and response systems.",
  "Introducing loyalty tracking dashboards.",
  "Training teams to personalize interactions based on data."
]
```

### `results` (on a project)
```json
[
  { "label": "Retention Growth", "value": "+45%" },
  { "label": "Client Referrals", "value": "+60%" },
  { "label": "Repeat Value",     "value": "+80%" }
]
```

### `nav_items`
```json
[
  { "label": "About",    "href": "#about"    },
  { "label": "Skills",   "href": "#skills"   },
  { "label": "Projects", "href": "#projects" },
  { "label": "Contact",  "href": "#contact"  }
]
```

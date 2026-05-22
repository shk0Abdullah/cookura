# Cookura

AI-powered recipe generator. Enter a dish name, get a full recipe with an image.

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+ (`npm i -g pnpm`)

## Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Copy the example env file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and fill in your keys:

- `UNSPLASH_ACCESS_KEY` — get one at [unsplash.com/developers](https://unsplash.com/developers)
- `GROQ_API_KEY` — get one at [console.groq.com](https://console.groq.com/)

3. Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), type a dish name, and hit Search.

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS v4**
- **Groq** (LLM recipe generation via Llama 3.3 70B)
- **Unsplash API** (dish images)
- **Biome** (lint + format)

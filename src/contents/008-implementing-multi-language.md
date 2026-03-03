---
title: "Implementing Multi-language Support"
description: "Implementing Multi-language Support in Next.js with next-intl"
pubDate: "Mar 03 2026"
categories: ["Frontend"]
---

#### Setup

```bash title="installation"
npm install next-intl
```

```bash title="Project-Structure"
├── messages/
│   ├── en.json
│   └── ko.json
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── navigation.ts
```

```json title="messages/en.json"
{
  "Index": {
    "title": "Welcome",
    "description": "This is the home page."
  }
}
```

```json title="messages/ko.json"
{
  "Index": {
    "title": "환영합니다",
    "description": "홈 페이지입니다."
  }
}
```

#### Configuration

```ts title="i18n/routing.ts"
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ko"],
  defaultLocale: "en",
});
```

```ts title="i18n/request.ts"
import { getRequestConfig } from "next-intl/server";
import { routing, Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

```ts title="i18n/navigation.ts"
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

Locale-aware wrappers for **Link**, **redirect**, **usePathname**, **useRouter**. Use these instead of **next/navigation** to preserve locale in URLs.

```ts title="proxy.ts"
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

**Middleware** handles locale detection and redirect automatically:

- **NEXT_LOCALE** cookie exists → redirect to that locale
- No cookie → detect from **Accept-Language** header
- No match → fallback to **defaultLocale** (en)

```ts title="next.config.mjs"
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

...
```

#### Implementation

```ts title="locale-switcher.tsx"
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@workspace/ui/components/button";

const LOCALE_COOKIE = "NEXT_LOCALE";

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggle = () => {
    const next = locale === "ko" ? "en" : "ko";

    // Set NEXT_LOCALE cookie so middleware redirects to this locale on next visit
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    router.push(pathname.replace(`/${locale}`, `/${next}`));
  };

  return <Button onClick={toggle}>{locale === "ko" ? "EN" : "한국어"}</Button>;
};
```

```ts title="layout.tsx"
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
```

#### Usage

```ts title="page.tsx"
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Index");

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}
```

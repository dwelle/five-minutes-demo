# five-minutes-demo

[![CircleCI](https://circleci.com/gh/typescript-fun/five-minutes-demo.svg?style=svg)](https://circleci.com/gh/typescript-fun/five-minutes-demo)

Typed functional programming in TypeScript in five minutes.

## Features

- Domain-driven design with io-ts.
- pipe, Option, Either, TaskEither etc.
- Browser/server validation.

## Getting Started

- clone repo
- `yarn` to install
- `yarn dev` to run

## Tips

### Imports

```ts
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import * as IO from 'fp-ts/lib/IO';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
```

## Tree Shaking

By default, when importing from lib (`import { pipe } from 'fp-ts/lib/pipeable'`), it takes the whole pipeable module with all its dependencies, 1.1 kB gzipped in case of pipe, because it takes also Either (look for 'Either' in compiled code).

Tree shaking works only with es6 modules. We can `import { pipe } from 'fp-ts/es6/pipeable'`, and then only the pipe function is imported, which is great, but to make it work with Next.js, we have to use next-transpile-modules `transpileModules: ['fp-ts'],`.

As for io-ts, it uses fp-ts/lib import so it can not be tree shaked, but that's fine, because it uses only Either module which is pretty small. The whole io-ts lib itself has only 4.2 kB gzipped. As I see it, we can save some kBs with tree shaking but fp-ts itself is already pretty small, so it makes sense only for micro optimizations. So recommended usage is driven by DX (developer experience), `import * as` makes API discoverable.

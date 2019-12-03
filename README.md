# five-minutes-demo

[![CircleCI](https://circleci.com/gh/typescript-fun/five-minutes-demo.svg?style=svg)](https://circleci.com/gh/typescript-fun/five-minutes-demo)

Explain typed functional programming in TypeScript in five minutes.

## Tree Shaking with fp-ts and io-ts

By default, when importing from lib (`import { pipe } from 'fp-ts/lib/pipeable'`), it takes the whole pipeable module with all its dependencies, 1.1 kB gzipped in case of pipe, because it takes also Either (look for 'Either' in compiled code).

Tree shaking works only with es6 modules. We can `import { pipe } from 'fp-ts/es6/pipeable'`, and then only the pipe function is imported, which is great, but to make it work with Next.js, we have to use next-transpile-modules `transpileModules: ['fp-ts'],`.

As for io-ts, it uses fp-ts/lib import so it can not be tree shaked, but that's fine, because it uses only Either module which is pretty small. The whole io-ts lib itself has only 4.2 kB gzipped.

As I see it, we can save some kBs with tree shaking but fp-ts itself is pretty small, so it makes sense only for micro optimizations.

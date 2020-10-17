# Story bot

**What is this:**
A ( not-inherently furry ) discord bot for telling interactive stories
  
## Running
For development:
```
npm run devel
```

For linting:
```
npm run lint
```

## Folder Structure
```
 src
  │   MongoHelper.ts    # Our MongoDB helper
  │   start.ts          # App entry point
  └───stories           # Where stories are kept
      └───{{username}   # Folder to organize stories by username
        └───{{story}}   # Where the story files are kept
  └───utility           # All our utility classes, like loggers

```

### Stories directory structure
Each user who contributes a story should create a new folder under `stories` with their username. Inside here you should create a folder for each story you aim to write, and then store its associated files inside

Please see `start.sh` for more

## Style guide
All functions will have a `DocBlock` to describe its purpose
```js
/**
* Short function description
*/
function name () {
  ...
}
```

All functions will be static typed
```js
/**
* Print name and age to console
*/
function name (name: String, age: Number): void {
  console.log(name, age)
}
```

Filenames to match class names
```js
// PatAdventure.ts
export class PatAdventure {
  ...
}
```

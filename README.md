# Story bot

**What is this:**
A ( not-inherently furry ) discord bot for telling interactive stories

## How to contribute a story
Contributing a new story is easy! To start, create a new folder in `stories/`. Best practice here is to use your username like `adventureco`. Inside your folder, create a new folder for each story you wish to make ( like `the cave`! Inside each story folder there must be a `start.txt` file as this is what the bot looks for to initialize a story.

Here is a quick example of story markup:
```
[Text]
Story text goes here.

It can be multiline

[Options]
Option text => link_to_page.txt

```

Every `page` needs a `[Text]` node and some text, but `[Options]` are optional

Options are broken down into two parts:
- The text that the user sees ( on the left of the pointer `=>` )
- The page that the text links to ( on the right of the pointer `=>` )

There are two example stories under stories/example to get you started!

**Notes:** Please ensure there is an empty new line at the end of your `page`! We use this to match sections in our regex search

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
  └───utility           # All our utility classes, like loggers
  └───models            # Stores all database models for the bot
 stories
  └───username          # Top level username folder
  └───└─story_name      # Story folder which houses the story assets

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

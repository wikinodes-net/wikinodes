# WikiNodes

WikiNodes is a project designed to bring the fork/diff/merge topology popularized by git/hub into the space of private collaboration. A user may, for example, add their life's work to their WikiNodes running on their local Holochain, and privately share any nodes or collections with users or groups they select. Users can then fork each other's nodes, and merge in changes from other users' forks.

## Features

### Creating Pages

- Pages can be imported from other wikis, or uploaded from local files
- Any creative commons (CC-BY-SA) licensed page from any existing site may be forked into, and modified within, WikiNodes

### Creating Collections

- User can group pages into collections
- Collections may differ across users and branches

### Groups

- Default group for self - only you
- Can create n groups with specific users
- Default group for all app users

### Sharing Pages & Collections

- User can share pages/collections with user or group

### Forking

- Any user can edit (fork) any page they are able to view
- Forker chooses visiblity of their fork:
  - `public`
  - `upstream` (author of forked page)
  - `collection` network (all upstream/downstream authors)
  - `private`

### Branches

- User can create branches to organize their work
- Branches may diverge from each other, and may fork off any point in any other branch, belonging to same or different user

### Merging

- Users can choose to merge changes from any other branch, their or otherwise, into any of their branches

### Trust Network

- Multilayered trust graphs allow users to filter what they see, eliminating spam and abuse

## Bonus Feature: Realtime Collaboration

- A user can share a link with friends/colleagues, to create a realtime collaboration session, which writes to a single fork, owned by the originating user

## Architecture

### DHTs

- The app has a DHT for coordination
- DHT per group, for sharing content -- this is invite only via code
- DHT for content shares with all users of app
- DHT for public content

### Collaboration

- We integrate [Syn](https://github.com/holochain/syn/blob/main/DESIGN.md) for realtime collaboration features
  - Possibly every edit, or major edits, or checkpoints, are spit out as Page Versions
- For reputation, we use one or both of [Trust Graph](https://github.com/trustgraph/trustgraph) (shown in diagrams) and/or [Sacred Capital](https://sacred-capital.gitbook.io/sacred-capital/).

### Correspondence to Git Concepts

| WikiNodes    | Git                       |
| ------------ | ------------------------- |
| Collection   | Repo                      |
| Branch       | Branch                    |
| Page Version | Commit (to a single file) |
| Tag          | Tag                       |
| Page         | File in non-bare repo     |

---

<!--
relevant docs:
- https://plantuml.com/ie-diagram
- https://plantuml.com/class-diagram
 -->

```plantuml
title Page Versions
hide circle
skinparam linetype ortho

entity User {
    id: <<public key>>
}

entity Group {
    admins: <<public key>>[]
    members:  <<public key>>[]
}

entity Branch {
    name: String
}

entity Page {
    id: <<uuid>>
}

entity Tag {
    content: String
}

entity "Page Version" {
    id: <<content hash>>
    title: String
    alternate titles: String[]
}

"Page Version" ||--o{ Tag
User }--{ Group
Group ||--o{ Collection
Collection ||--{ Branch
Branch ||--{ "Page Version"
Page ||--{ "Page Version"
```

---

```plantuml
title Single Level Trust Graph

hide circle
skinparam linetype ortho

entity Viewer {
    id: <<public key>>
}

entity User {
    id: <<public key>>
}

entity Rating {
    source: <<public key>>
    target: <<public key>> or <<content hash>>
    value: 0..1
    content: String
}

entity "Page Version" {
    id: <<content hash>>
}


Viewer ||--o{ Rating: //source//
Rating ||--o| "Page Version": //target//
Rating ||--o| User: //target//
```

---

```plantuml
title Multi Level Trust Graph

hide circle
skinparam linetype ortho

entity Viewer {
    id: <<public key>>
}

entity Reviewer {
    id: <<public key>>
}

entity "Level 1 Rating" {
    source: <<public key>>
    target: <<public key>>
    value: 0..1
    content: String
}

entity "Level 2 Rating" {
    source: <<public key>>
    target: <<public key>> or <<content hash>>
    value: 0..1
    content: String
}

Viewer ||--o{ "Level 1 Rating": //source//
"Level 1 Rating" ||--|| Reviewer: //target//

Reviewer ||--o{ "Level 2 Rating": //source//
"Level 2 Rating" ||--o| "Page Version": //target//
"Level 2 Rating" ||--o| User: //target//
```

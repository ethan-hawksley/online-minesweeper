# MineDuo

## About

A port of Minesweeper so it can be played either by one person, or two people using a peer-to-peer connection.

## Features

1. Two different modes to play
2. Three different difficulties, and a custom difficulty setting
3. Global wireless multiplayer through WebRTC
4. Fully featured singleplayer
5. Recursive revealing of safe tiles
6. Flagging of suspicious tiles
7. Optional sound effects to accompany actions
8. Light and dark mode support

## Usage

1. Clone the repository:
   ```shell
   git clone https://github.com/ethan-hawksley/online-minesweeper
   cd online-minesweeper
   ```
2. Start a local development server
   ```shell
   npx serve
   ```
3. Visit the website in your browser. This is typically hosted at http://localhost:3000 but your machine may vary.

## Hosting

1. Fork this repository on GitHub
2. Navigate to the repository settings, and to the Pages section
3. Set to deploy from your `main` branch, and the `/` directory. Wait for GitHub to finish building the project.
4. Visit your newly deployed site!

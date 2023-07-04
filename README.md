# tank-game-bot

Implementation of https://youtu.be/aOYbR-Q_4Hs for a Discord server.

Can AI code better and faster than iluha168? [Probably.](https://github.com/iluha168/DiscordTankGame)

Yes, major parts of this bot are created with AI, including most of this README.

## Commands

I mean, Discord's slash commands menu shows you all available command and descriptions, but here you go

-   `/action` Perform an action with your tank. Each action costs one action point to execute. After each action, you will be placed on a 15 minute cooldown before you can execute your next action.

    -   `/action attack` Fire your cannon at a tank within range and reduce their health by one.

    -   `/action send-ap` Send one action point to a tank within range.

    -   `/action move` Drive your tank to a different location on the grid within range. You cannot move to a spot that is already occupied by another tank.

-   `/board` View the current state of the game board.

-   `/grant-ap-all` Grant one action point to every tank in the game. This command is only available to admins by default.

-   `/join-game` Join the game and create a new tank with a random position on the grid.

## Running locally

There's a Dockerfile, what more do you expect?

```
pnpm
pnpm start
```

The database is [Pocketbase](https://pocketbase.io), migrations are in the `pb_migrations` directory.

## License and disclaimer

This project is licensed under the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).

This project is not affiliated with or endorsed by Discord. Use at your own risk.

Copyright (c) 2023 Bobby-McBobface

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.

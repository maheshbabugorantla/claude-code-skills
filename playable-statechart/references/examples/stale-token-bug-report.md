# Bug

TLC reached 36 states and 90 steps. The chart draws 6 states and 8 arrows.
The chart does not draw 66 steps that stay in one chart state.

## NeverServeExpiredToken breaks
The shortest path has 6 steps:
0. freshly issued
1. a minute passes: valid
2. a minute passes: valid
3. a minute passes: nearly expired
4. a minute passes: expired
5. a burst of requests starts: expired
6. a request is served [during a burst]: an expired token is served

## Rules that hold
TypeOK, NoDeadlock

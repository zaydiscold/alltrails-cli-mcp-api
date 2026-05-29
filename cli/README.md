# `@zaydiscold/alltrails-cli`

Personal live CLI for local AllTrails route maps, reads, and write actions. Mutating commands are real unless `--dry-run` is passed.

```bash
alltrails-cli doctor --json
alltrails-cli api-map routes --json
alltrails-cli trail plan 10027248 --detail offline --json
alltrails-cli trail get 10027248 --detail offline --json
alltrails-cli search plan "Half Dome" --lat 37.746 --lng -119.533 --radius 25 --json
alltrails-cli write execute favorite-add 10027248 --dry-run --json
alltrails-cli write execute favorite-add 10027248 --json
```

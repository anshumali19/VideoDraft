#!/bin/bash
# Render worker: pulls names from build/queue.txt one at a time.
cd "$(dirname "$0")/.."
while true; do
  n=$(flock build/queue.lock bash -c 'n=$(head -n1 build/queue.txt); [ -n "$n" ] && sed -i 1d build/queue.txt; echo $n')
  [ -z "$n" ] && { sleep 5; [ -f build/queue.stop ] && exit 0; continue; }
  node src/render.js "$n" > "build/r_$n.log" 2>&1 && python3 src/mix.py "$n" >> "build/r_$n.log" 2>&1 && echo "done $n" >> build/queue.done
done

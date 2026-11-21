# Arcs

An arc is the shape of the lesson. Pick the one whose skeleton matches the takeaway, then adapt the beats. Tags in brackets.

## follow-one-request

For "what happens when...". One request, traced from start to finish.

1. [problem] The reader's pain, with the system as they know it
2. [idea] The piece this lesson is about enters
3. [mechanism] First thing it does to the request
4. [mechanism] Second thing
5. [mechanism] Third thing (stop at three or four)
6. [failure] Something downstream breaks
7. [fix] How the piece responds
8. [tradeoff] What the piece costs

Gauges that work: time per hop, a count the piece reduces, errors the caller sees.

## break-then-fix

For "why do we need...". A working system meets a load or a fault.

1. [problem] The simple system, working
2. [failure] Pressure arrives: a gauge goes bad
3. [mechanism] Why it broke: the one constraint
4. [idea] The change that removes the constraint
5. [fix] The same pressure again: the gauge holds
6. [failure] The new limit this change has
7. [tradeoff] What you now maintain

Gauges that work: the pressure itself (requests per second, queue depth) and the symptom (latency, error rate).

## scale-up

For "how does this grow...". Start with one box and add a piece each time something saturates.

1. [problem] One box does everything
2. [failure] First thing to saturate
3. [fix] Add the piece that relieves it
4. [failure] Next thing to saturate
5. [fix] Add the next piece
6. [recap] The grown system, and which piece answers which pressure
7. [tradeoff] What each piece added to operate

Keep it to two or three rounds. Each round is one failure and one fix.

## compare-two

For "X or Y?". The same job done two ways, side by side in two zones.

1. [problem] The job both designs must do
2. [mechanism] Design A handles a request
3. [mechanism] Design B handles the same request
4. [failure] A condition where A struggles
5. [failure] A condition where B struggles
6. [tradeoff] When each wins, stated as conditions

Use the same gauges for both sides so the reader compares like with like.

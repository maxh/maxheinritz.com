---
title: "Pedestrian Greed"
layout: post
tags: ["math"]
---

I have a persistent memory of walking home late one night in West Philadelphia with my college roommates. We were heading back to our house — two blocks south and five blocks east through the standard Penn-area grid — and at one intersection we hit a stop sign. Street was empty. We could have crossed. I suggested we not.

My roommates were understandably confused. Why wait? The way is clear.

I had some vague intuition that crossing there was wrong — that we should be saving that southward crossing for later — but the words weren't there. Something about running out of options. Something about flexibility. It sat in a fog somewhere between a feeling and an argument, and I gave up trying to explain it. We crossed. We got home fine.

That was about two decades ago. The question rattled around in the back of my mind ever since. Now, with LLMs to think through half-baked intuitions with, I finally have an answer.

## The setup

Imagine a standard city grid. Some intersections have traffic lights, some have stop signs. You need to get from A to B — in this case, two blocks south and five blocks east. Every valid route covers the same seven blocks, so you can't optimize by going shorter. What you *can* optimize is expected time: crossing time plus waiting time.

At a stop sign with light traffic, crossing is nearly instant. At a red light, you wait. The question is whether the *order* in which you spend your south and east crossings affects total expected wait — and if so, how to choose.

Here's a sample grid — open circles are stop signs, filled circles are traffic lights:

<svg viewBox="0 0 230 268" xmlns="http://www.w3.org/2000/svg" width="230" style="display:block;margin:1.5em 0;">
  <!-- xs=[45,115,185]  ys=[28,72,116,160,204,248]  spacing: 70h 44v -->
  <!-- node types (T=light=filled, S=stop=open), checkerboard pattern -->

  <!-- edges (crosswalks) -->
  <line x1="45" y1="28" x2="115" y2="28" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="28" x2="185" y2="28" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="72" x2="115" y2="72" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="72" x2="185" y2="72" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="116" x2="115" y2="116" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="116" x2="185" y2="116" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="160" x2="115" y2="160" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="160" x2="185" y2="160" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="204" x2="115" y2="204" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="204" x2="185" y2="204" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="248" x2="115" y2="248" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="248" x2="185" y2="248" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="28" x2="45" y2="72" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="72" x2="45" y2="116" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="116" x2="45" y2="160" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="160" x2="45" y2="204" stroke="#aaa" stroke-width="1.2"/>
  <line x1="45" y1="204" x2="45" y2="248" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="28" x2="115" y2="72" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="72" x2="115" y2="116" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="116" x2="115" y2="160" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="160" x2="115" y2="204" stroke="#aaa" stroke-width="1.2"/>
  <line x1="115" y1="204" x2="115" y2="248" stroke="#aaa" stroke-width="1.2"/>
  <line x1="185" y1="28" x2="185" y2="72" stroke="#aaa" stroke-width="1.2"/>
  <line x1="185" y1="72" x2="185" y2="116" stroke="#aaa" stroke-width="1.2"/>
  <line x1="185" y1="116" x2="185" y2="160" stroke="#aaa" stroke-width="1.2"/>
  <line x1="185" y1="160" x2="185" y2="204" stroke="#aaa" stroke-width="1.2"/>
  <line x1="185" y1="204" x2="185" y2="248" stroke="#aaa" stroke-width="1.2"/>

  <!-- nodes: T=traffic light (filled), S=stop sign (open), checkerboard -->
  <!-- row 0: T S T -->
  <circle cx="45"  cy="28"  r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <circle cx="115" cy="28"  r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <circle cx="185" cy="28"  r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <!-- row 1: S T S -->
  <circle cx="45"  cy="72"  r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <circle cx="115" cy="72"  r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <circle cx="185" cy="72"  r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <!-- row 2: T S T -->
  <circle cx="45"  cy="116" r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <circle cx="115" cy="116" r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <circle cx="185" cy="116" r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <!-- row 3: S T S -->
  <circle cx="45"  cy="160" r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <circle cx="115" cy="160" r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <circle cx="185" cy="160" r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <!-- row 4: T S T -->
  <circle cx="45"  cy="204" r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <circle cx="115" cy="204" r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <circle cx="185" cy="204" r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <!-- row 5: S T S -->
  <circle cx="45"  cy="248" r="5" fill="white" stroke="#333" stroke-width="1.2"/>
  <circle cx="115" cy="248" r="5" fill="#444" stroke="#333" stroke-width="1.2"/>
  <circle cx="185" cy="248" r="5" fill="white" stroke="#333" stroke-width="1.2"/>

  <!-- start / end -->
  <text x="33" y="24" text-anchor="end" font-size="10" font-weight="bold" fill="#333" font-family="sans-serif">start</text>
  <text x="197" y="252" text-anchor="start" font-size="10" font-weight="bold" fill="#333" font-family="sans-serif">end</text>

  <!-- legend -->
  <text x="45" y="264" font-size="8" fill="#aaa" font-family="sans-serif">● traffic light · ○ stop sign</text>
</svg>

At each corner you face three options: cross the street ahead (may require waiting), turn onto the perpendicular street (always free), or wait. Turning is free because you're staying on the same side of the street — you're just changing which direction you walk next. The wait cost only applies when you actually cross.

This means what you're really managing is a set of *crossings* — 2 east-west street crossings (for south progress) and 5 north-south street crossings (for east progress). Turning and walking don't consume a crossing. You decide when and where to cash each one.

## The probability argument

Here's the clean way to see what I was sensing.

When you arrive at a traffic light and want to cross, the light is in some random state. It might permit a south crossing only, an east crossing only, both, or neither. If you still need both kinds of crossings, define your set of needed crossings as A = {S, E}. If you've already spent all your south crossings, A = {E}.

Your probability of making progress at any given crossing attempt is:

> P(progress) = P(light state permits at least one crossing in A)

Compare two situations approaching a random light:

**Still need both S and E crossings** — Three of four states work (S-only, E-only, both). P(progress) = 3/4.

**Already spent south, only need E** — Two of four states work (E-only, both). P(progress) = 2/4.

Spending a south crossing early — even for free, at a stop sign — *reduces your probability of making progress at every subsequent crossing attempt*. More needed crossing types means more light states that work for you.

But turns being free adds a second dimension to the option value. If you've saved your south crossings and you hit a long red on an east crossing, you don't have to stand there — you can turn south, walk freely to the next block, and try a different east crossing there. You're routing around the bad light. If you've spent all your south crossings, that escape isn't available: you're committed to whatever east crossings you encounter directly ahead.

This is the formal version of what I was sensing: the south crossing had option value on two levels. It could substitute for a bad east crossing directly, *and* it gave us the freedom to physically move to a better crossing opportunity. Using it early at a free stop sign destroyed both.

## The simulation

To see how much this matters in practice across a whole city, I wrote a JavaScript simulation.

It models the 2S / 5E trip. Intersections are sampled as either stop signs (both directions always available) or traffic lights (random phase: S-only, E-only, both, or neither). Two policies are tested:

- **Spend South**: when both directions are available, take south first
- **Save South**: when both are available, prefer east; save south for when east is blocked

```javascript
function chooseMove(policy, southRem, eastRem, available) {
  const hasS = available.has("S") && southRem > 0;
  const hasE = available.has("E") && eastRem > 0;
  if (!hasS && !hasE) return null;
  if (policy === "spendSouth") return hasS ? "S" : "E";
  if (policy === "saveSouth")  return hasE ? "E" : "S";
}
```

Running 200,000 trials per policy, with a 3-unit wait penalty for blocked crossings, across three different city configurations:

**Typical asymmetric city** (east-only lights twice as common as south-only):

| Policy      | Avg time |
|-------------|----------|
| Spend South | 13.11    |
| Save South  | 12.77    |

Save South wins by about 2.6%.

**Symmetric city** (south-only and east-only lights equally common):

| Policy      | Avg time |
|-------------|----------|
| Spend South | 12.67    |
| Save South  | 11.02    |

Save South wins by 13%. The advantage grows when the two directions are balanced, because south "escape hatches" become genuinely useful.

**Highly asymmetric city** (east-only lights 8x more common than south-only):

| Policy      | Avg time |
|-------------|----------|
| Spend South | 11.96    |
| Save South  | 14.81    |

Save South *loses* by 24%. When south-only openings are very rare, saving south for them provides almost no value — the escape hatches never materialize. Meanwhile, south moves that could have been spent freely at stop signs are held in reserve until the very end, where you're forced to take them at whatever intersections remain regardless of timing.

## So was I right?

Sort of, conditionally.

The intuition points at something real. South moves have option value, and option value is real. In a symmetric city the advantage is meaningful — 13%. But in the actual West Philadelphia grid that night, the relevant question is whether south-only and east-only signal opportunities were roughly balanced. In a typical asymmetric city they aren't, and the advantage collapses to 2-3%.

The right version of the advice is more nuanced: save your scarce directional moves when the other direction has meaningfully better signal timing. If east is heavily favored — most lights are cycling to give you walk signals heading east — then saving south matters less, because south-only escape hatches will be rare. In that case, spend south freely at stop signs and ride the eastward flow.

If south and east are roughly equally signaled, then yes, save south. The option value is real and the improvement is substantial.

There's a subtlety worth naming. A strictly optimal policy would require knowing the distribution of light states at each intersection — essentially solving a Markov decision process. You don't have that information walking around at night. But the probability argument above doesn't need it: having more needed crossing types improves your odds at *any* light distribution. Both policies here are greedy algorithms — Spend South is greedy over immediate progress, Save South is greedy over future optionality — and the latter happens to be well-motivated without any model assumptions at all.

That night in West Philly? I have no idea which regime we were in. I just had the intuition, couldn't explain it, and we crossed anyway.

Some questions take a decade or two to formalize. At least now I know what I was trying to say.

---

*Full simulation code: [city-grid-sim.js](https://gist.github.com/placeholder)*

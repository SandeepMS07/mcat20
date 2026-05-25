# Season 3 Widget APIs

Reference for every external endpoint this codebase consumes to render
T20 Mumbai Season 3 fixtures, standings, scorecards, stats, and ball-by-ball
data. All endpoints are public JSONP feeds on the same CloudFront
distribution that powers the legacy third-party match centre widget.

---

## 1. Quick facts

| | |
|---|---|
| **Base URL** | `https://d3ml9nicy4vh6j.cloudfront.net/feeds` |
| **Auth** | None — public, CDN-cached |
| **Format** | JSONP-wrapped JSON (must strip the wrapper, see §5) |
| **Cache headers** | Standard CloudFront; we set `next: { revalidate: 3600 }` server-side |
| **CORS** | Not enabled — fetch server-side, or use `<script>` injection in browser |
| **Season 3 CompetitionID** | `63` |
| **Season 3 MatchID range** | `1644 – 1666` (23 matches, all `MatchStatus: "Post"`) |

Other tournament IDs hosted on the same base (for reference, not used):

| CompetitionID | Tournament |
|---|---|
| `30` | MCA Blue vs Yellow trial (Dec 2024, 6 matches) |
| `63` | **T20 Mumbai League Season 3** (Jun 2025) |
| `113` | T20 Mumbai 2026 competition (Jan–May 2026) |

---

## 2. Endpoints we use

### 2.1 Tournament-level — `/feeds/{cid}-…`

| Endpoint | Returns | Used by |
|---|---|---|
| `/{cid}-matchschedule.js?v={ts}` | Array of match objects (schedule + final scores + winning team) | Snapshotted as [`src/utilis/fixtures/season3-results.json`](../src/utilis/fixtures/season3-results.json), consumed in [`src/app/fixtures/page.jsx`](../src/app/fixtures/page.jsx) by `processSeason3Matches` |
| `/stats/{cid}-groupstandings.js?v={ts}` | Points-table rows | Available for future points-table page; backend equivalent already exposed at `/v1/live/season3/standings` |

Wrapper for `matchschedule`: **bare JSON array** — no callback function, just `[{...}, …]`. Match it with `/\[\{[\s\S]*\}\]/`.

### 2.2 Per-match — `/feeds/{matchID}-…`

| Endpoint | Returns | Used by |
|---|---|---|
| `/{matchID}-matchsummary.js?v={ts}` | `{MatchSummary: [{...}]}` — header data, final scores per innings, toss, MOM, winning team, player-of-the-match | [`src/app/scores/[game_id]/season3Loader.js`](../src/app/scores/[game_id]/season3Loader.js) |
| `/{matchID}-Innings1.js?v={ts}` | `{Innings1: {...}}` — full 1st-innings detail (see §3) | same loader |
| `/{matchID}-Innings2.js?v={ts}` | `{Innings2: {...}}` — full 2nd-innings detail | same loader |

JSONP callback names (wrappers to strip):

| Endpoint | Wrapper |
|---|---|
| `…-matchsummary.js`   | `onScoringMatchsummary({…})`            |
| `…-Innings{N}.js`     | `onScoring({…})`                         |
| `…-matchschedule.js`  | *(none — bare array)*                    |
| `…-groupstandings.js` | *(verify on first fetch — likely `on…`)* |

### 2.3 Available but not currently consumed

These are valid endpoints discovered in the widget bundle. We have not wired
them into the site yet — list kept for parity if/when we extend the match
centre or build a Season 3 stats page.

| Endpoint | Purpose |
|---|---|
| `/stats/{cid}-teamlist.js?v={ts}` | Squad list for the tournament |
| `/stats/{cid}-teamoverallstats.js?v={ts}` | Team-level aggregate stats |
| `/stats/{cid}-tournamentmasterkpi.js?v={ts}` | Master KPI rollup |
| `/stats/{cid}-tournamentkeyperformer.js?v={ts}` | Top performers feed |
| `/stats/{cid}-squad.js?v={ts}` | Detailed squad info |
| `/stats/{cid}-{teamID}-playerstats.js?v={ts}` | Per-team player stat lines |
| `/{matchID}-kpi.js?v={ts}` | Per-match KPI snapshot |
| `/{matchID}-matchnotes.js?v={ts}` | Match notes / commentary blurbs |

Additional JSONP callback names observed in the widget bundle:
`onteamlist=_jqjsp`, `onteamoverallstats`, `onKeyPerformer`, `onplayerstats`.

---

## 3. Data shapes (key fields only)

### `matchschedule` row (and `season3-results.json`)

```
CompetitionID, MatchID, MatchTypeID, MatchType ("T20"), MatchStatus ("Post"),
MatchDate ("YYYY-MM-DD"), MatchTime ("HH:MM"), MatchName,
FirstBattingTeamID,  FirstBattingTeamName,  FirstBattingTeamCode,
SecondBattingTeamID, SecondBattingTeamName, SecondBattingTeamCode,
GroundName, ROUND_NAME ("Round I" … "Semi Final 1" … "Final"),
Commentss / Comments ("MSC Maratha Royals Won by 5 Wickets"),
FirstBattingSummary ("157/4 (20.0 Ov)"),  SecondBattingSummary,
TossDetails, TossTeam, TossText,
HomeTeamLogo (URL), AwayTeamLogo (URL),
WinningTeamID, DivisionID,
1Summary..4Summary, 1FallScore/Wickets/Overs/RunRate (mirrored 2..4)
```

### `matchsummary[0]`

```
MatchID, CompetitionID, CompetitionName ("T20 MUMBAI LEAGUE 2025 SEASON 3"),
Team1, Team2, MatchName, MatchDate ("12 Jun 2025"), GroundName,
FirstBattingTeam(+ID/+Logo), SecondBattingTeam(+ID/+Logo),
TossDetails, Comments ("X Won by N Wickets (Winners)"),
Target, IsMatchEnd (0/1), MOM,  WinningTeamID,
1Summary..4Summary,  1FallScore/Wickets/Overs/RunRate (mirrored 2..4),
CurrentInnings, CurrentStriker(Name/ID/Runs/Balls/4s/6s/SR),
CurrentNonStriker(…),  CurrentBowler(Name/ID/Overs/Runs/Wkts/Econ/SR),
Scorer1Name, Umpire1..3Name, Referee, VideoAnalyst1/2,
IsSuperOver, Innings{1..4}Declare, RevisedOver, RevisedTarget
```

### `Innings{N}`

```
BattingCard:   [{ PlayerName, OutDesc, Runs, Balls, DotBalls, Ones..Sixes,
                  StrikeRate, BoundaryPercentage, MinOver, MinStrikerOver,
                  PlayingOrder, WicketNo, AgainstFast, AgainstSpin, … }]
BowlingCard:   [{ PlayerName, Overs, Maidens, Runs, Wickets,
                  Wides, NoBalls, Economy, BowlingOrder,
                  TotalLegalBallsBowled, ScoringBalls, DotBalls,
                  Ones..Sixes, StrikeRate, FourPercent, SixPercent, … }]
Extras:        [{ Total, TotalExtras, Byes, LegByes, Wides, NoBalls,
                  Penalty, CurrentRunRate, FallScore/Wickets/Overs,
                  BattingTeamName, BowlingTeamName, MaxPartnerShipRuns }]
FallOfWickets: [{ Score ("31/1(4.3)"), PlayerName, FallOvers, FallWickets }]
PartnershipScores, PartnershipBreak
ManhattanGraph: [{ OverNo, OverRuns, BowlerRuns, BowlerID, Wickets, Bowler }]
ManhattanWickets: [{ OverNo, OutBatsman, OutDesc, BatsmanRuns, BatsmanBalls }]
WagonWheel:    [{ FielderAngle, FielderLengthRatio, Runs, IsFour, IsSix,
                  BatType (R/L), StrikerID, BowlerID, BallID }]
WagonWheelSummary
OverHistory:   [ ball-by-ball, 120+ entries per innings — see §4 ]
battingheadtohead, bowlingheadtohead — per-matchup KPI rows
```

---

## 4. Ball-by-ball (`OverHistory`)

One entry per delivery. ~123 balls per innings in Season 3.

Key fields:

```
BallID, BallUniqueID, ActualBallNo, MatchID, InningsNo,
BattingTeamID, TeamName,
StrikerID, NonStrikerID, BatsManName,
BowlerID, BowlerName, BowlerType,
OverNo (1..20), OverName ("One"…), BallNo ("0.1"), BallName,
Runs, BallRuns, RunsText ("Zero"/"Four"/…), ActualRuns,
IsOne, IsTwo, IsThree, IsFour, IsSix, IsDotball,
Extras, IsWide, IsNoBall, IsBye, IsLegBye, IsFreeHit, IsBouncer,
IsWicket, WicketType, Wickets, OutBatsManID, IsBowlerWicket,
CommentOver ("Over 0.1"), CommentStrikers ("X TO Y"),
Commentry, NewCommentry,
VideoFile  (e.g. "MMRVSSMF12062025-SMF-Inn1-Over1-Ball1.mp4"),
Xpitch, Ypitch  (pitch-map coords — empty in this dataset),
TotalRuns, TotalWickets  (running cumulative),
IsFifty, IsHundred, IsTwoHundred, IsHattrick, IsMaiden,
BowlTypeID, BowlTypeName, ShotTypeID, ShotType
```

The `VideoFile` field references clips on a separate CDN — not enumerated
here; available for future ball-by-ball video playback.

---

## 5. Stripping the JSONP wrapper

All wrapped endpoints look like `someCallback({...});` or `someCallback({...})`.
Extract the JSON object/array with a regex:

```js
const text = await (await fetch(url)).text();
const json = JSON.parse(text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)[0]);
```

That single regex handles both wrapped objects (`{…}`) and the bare-array
case (`matchschedule`).

Implementation reference: [`src/app/scores/[game_id]/season3Loader.js`](../src/app/scores/[game_id]/season3Loader.js).

---

## 6. CORS and where to call from

| Caller | Works? | Notes |
|---|---|---|
| Server-side Next.js fetch (RSC, route handlers) | ✅ | What we use. No CORS, supports `revalidate`. |
| Mobile apps (React Native / Flutter / native) | ✅ | No browser CORS. Plain fetch + regex extract. |
| Browser `fetch()` from our origin | ❌ | CloudFront does not send `Access-Control-Allow-Origin`. |
| Browser `<script>` tag injection (legacy JSONP) | ✅ | What the original third-party widget does. Requires defining a global named after the callback. |

---

## 7. Related / superseded endpoints

| Endpoint | Status | Comment |
|---|---|---|
| `https://d3ml9nicy4vh6j.cloudfront.net/t20mumbai/competitionURLMapping.json` | **404** | Widget bootstrap mapping (season → feedsource + CompetitionID). File no longer exists on the CDN, so the upstream widget cannot self-configure for new seasons. We hardcode CompetitionID 63. |
| `https://dqdkb7nduvxfx.cloudfront.net/feeds/…` | 403 from CLI | Alternate CDN referenced in the matchcentre Angular bundle. We don't use it. |
| `https://mca-prod-api.ken42.com/v1/live/season3/fixtures` | 200 but stale | MCA backend; returns the pre-tournament schedule (CID 30) without scores. **Do not use** for Season 3 — use the CloudFront `63-matchschedule.js` instead. |
| `https://mca-prod-api.ken42.com/v1/live/season3/standings` | 200, correct | MCA backend; mirrors the CloudFront standings (CID 63). Already wired as `getStandings()` in [`src/app/api/clientApi.js`](../src/app/api/clientApi.js). |

---

## 8. Where each feed is consumed in this repo

| Endpoint | File | Function |
|---|---|---|
| `63-matchschedule.js` (snapshotted) | [`src/utilis/fixtures/season3-results.json`](../src/utilis/fixtures/season3-results.json) | Static import |
| (above) → unified MatchCard shape | [`src/app/fixtures/page.jsx`](../src/app/fixtures/page.jsx) | `processSeason3Matches` |
| `{matchID}-matchsummary.js`<br>`{matchID}-Innings1.js`<br>`{matchID}-Innings2.js` | [`src/app/scores/[game_id]/season3Loader.js`](../src/app/scores/[game_id]/season3Loader.js) | `loadSeason3Match(matchID)` |
| Rendered | [`src/app/scores/[game_id]/Season3ScoreCard.jsx`](../src/app/scores/[game_id]/Season3ScoreCard.jsx) | UI |
| Numeric MatchID detection | [`src/app/scores/[game_id]/page.jsx`](../src/app/scores/[game_id]/page.jsx) | `isSeason3MatchId` → dispatch |

---

## 9. Refresh / re-snapshot

The Season 3 schedule won't change again (tournament complete). To refresh
[`season3-results.json`](../src/utilis/fixtures/season3-results.json) if
needed:

```bash
curl -s "https://d3ml9nicy4vh6j.cloudfront.net/feeds/63-matchschedule.js?t=$(date +%s)" \
  | python3 -c "
import re, sys, json
txt = sys.stdin.read()
arr = json.loads(re.search(r'\[\{.*\}\]', txt, re.S).group(0))
arr.sort(key=lambda d: (d['MatchDate'], d['MatchTime']))
json.dump(arr, open('src/utilis/fixtures/season3-results.json','w'), indent=2)
"
```

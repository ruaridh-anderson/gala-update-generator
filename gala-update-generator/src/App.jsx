import { useState, useEffect } from "react";
import './App.css';

const toneOptions = ["Professional", "Excited", "Banter"];
const eventPresets = [
  "Try",
  "Conversion",
  "Penalty",
  "Yellow Card",
  "Red Card",
  "Half Time",
  "Full Time",
  "Injury",
  "Substitution"
];

export default function App() {
  const [page, setPage] = useState("setup");
  const [minute, setMinute] = useState("");
  const [event, setEvent] = useState(eventPresets[0]);
  const [player, setPlayer] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState("");
  const [tone, setTone] = useState(toneOptions[0]);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [output, setOutput] = useState("");

  const [squad, setSquad] = useState(() => {
    const saved = localStorage.getItem("galaSquad");
    return saved ? JSON.parse(saved) : [];
  });

  const [matchDetails, setMatchDetails] = useState(() => {
    const saved = localStorage.getItem("galaMatchDetails");
    return saved ? JSON.parse(saved) : {
      opponent: "",
      location: "",
      date: "",
      competition: ""
    };
  });

  useEffect(() => {
    localStorage.setItem("galaSquad", JSON.stringify(squad));
  }, [squad]);

  useEffect(() => {
    localStorage.setItem("galaMatchDetails", JSON.stringify(matchDetails));
  }, [matchDetails]);

  const generateUpdate = () => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let base = `**${minute || timestamp}' | ${event.toUpperCase()} | Gala RFC vs ${matchDetails.opponent}**`;

    if (player) base += `\n${player} ${description ? description : "makes the difference!"}`;
    if (score) base += `\n**${score}**`;

    if (tone === "Excited") base += `\n_The Maroons are flying!_`;
    else if (tone === "Banter") base += `\n_Tell your pals — Gala means business._`;

    if (includeHashtags) base += `\n#GalaRugby #WeAreMaroon`;

    setOutput(base);
  };

  const copyToClipboard = async () => await navigator.clipboard.writeText(output);

  const addToSquad = () => {
    const trimmed = player.trim();
    if (trimmed && !squad.includes(trimmed)) setSquad([...squad, trimmed]);
    setPlayer("");
  };

  const removeFromSquad = (name) => {
    setSquad(squad.filter(p => p !== name));
  };

  const clearSquad = () => {
    setSquad([]);
  };

  const handleMatchDetailChange = (key, value) => {
    setMatchDetails(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container">
      <header className="grfc-header">
        <img src="/logo-placeholder.png" alt="Gala RFC Logo" className="grfc-logo" />
        <h1>Gala RFC Matchday Toolkit</h1>
        <nav>
          <button onClick={() => setPage("setup")} className={page === "setup" ? "active" : ""}>⚙️ Setup</button>
          <button onClick={() => setPage("match")} className={page === "match" ? "active" : ""}>🏉 Match</button>
        </nav>
      </header>

      {page === "setup" && (
        <div>
          <h2>⚙️ Pre-Match Setup</h2>
          <div className="form-grid">
            <div><label>Opponent:</label><input value={matchDetails.opponent} onChange={e => handleMatchDetailChange("opponent", e.target.value)} /></div>
            <div><label>Date:</label><input type="date" value={matchDetails.date} onChange={e => handleMatchDetailChange("date", e.target.value)} /></div>
            <div><label>Location:</label><input value={matchDetails.location} onChange={e => handleMatchDetailChange("location", e.target.value)} /></div>
            <div><label>Competition:</label><input value={matchDetails.competition} onChange={e => handleMatchDetailChange("competition", e.target.value)} /></div>
          </div>

          <h3>🎽 Squad</h3>
          <div className="form-grid">
            <div><label>Player Name:</label><input value={player} onChange={e => setPlayer(e.target.value)} placeholder="Add player to squad" /><button className="btn-small" onClick={addToSquad}>Add</button></div>
            <ul>{squad.map((p, idx) => (<li key={idx}>{p} <button onClick={() => removeFromSquad(p)}>Remove</button></li>))}</ul>
            <button className="btn-small" onClick={clearSquad}>Clear Squad</button>
          </div>
          <button className="btn" onClick={() => setPage("match")}>Start Match</button>
        </div>
      )}

      {page === "match" && (
        <div>
          <h2>🏉 Match Update Center</h2>
          <div className="form-grid">
            <div><label>Minute:</label><input value={minute} onChange={e => setMinute(e.target.value)} placeholder="e.g. 52" /></div>
            <div><label>Event:</label><select value={event} onChange={e => setEvent(e.target.value)}>{eventPresets.map(evt => <option key={evt}>{evt}</option>)}</select></div>
            <div><label>Player(s):</label><input value={player} onChange={e => setPlayer(e.target.value)} placeholder="Name(s)" /></div>
            <div><label>Description:</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. bursts through the line" /></div>
            <div><label>Score:</label><input value={score} onChange={e => setScore(e.target.value)} placeholder="Gala 26 - 21 Stirling County" /></div>
            <div><label>Tone:</label><select value={tone} onChange={e => setTone(e.target.value)}>{toneOptions.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="checkbox"><label><input type="checkbox" checked={includeHashtags} onChange={() => setIncludeHashtags(!includeHashtags)} /> Include hashtags</label></div>
          </div>
          <button className="btn" onClick={generateUpdate}>Generate Update</button>
          {output && (<div className="output-box"><pre>{output}</pre><button className="btn-small" onClick={copyToClipboard}>Copy to Clipboard</button></div>)}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

export default function App() {
  const [minute, setMinute] = useState("");
  const [event, setEvent] = useState("");
  const [player, setPlayer] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState("");
  const [tone, setTone] = useState("Professional");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [output, setOutput] = useState("");

  const generateUpdate = () => {
    let base = `**${minute}' | ${event.toUpperCase()} | Gala RFC**`;
    if (player) base += `\n${player} ${description ? description : "makes the difference!"}`;
    if (score) base += `\n**${score}**`;

    if (tone === "Excited") {
      base += `\n_The Maroons are flying!_`;
    } else if (tone === "Banter") {
      base += `\n_Tell your pals — Gala means business._`;
    }

    if (includeHashtags) {
      base += `\n#GalaRugby #WeAreMaroon`;
    }

    setOutput(base);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gala RFC Matchday Update Generator</h1>
      <input placeholder="Minute (e.g. 52)" value={minute} onChange={e => setMinute(e.target.value)} /><br/>
      <input placeholder="Event (Try, Penalty, Yellow Card...)" value={event} onChange={e => setEvent(e.target.value)} /><br/>
      <input placeholder="Player Name(s)" value={player} onChange={e => setPlayer(e.target.value)} /><br/>
      <input placeholder="Description of the play (optional)" value={description} onChange={e => setDescription(e.target.value)} /><br/>
      <input placeholder="Current Score (e.g. Gala 19 - 14 Stirling County)" value={score} onChange={e => setScore(e.target.value)} /><br/>
      <label>Tone: </label>
      <select value={tone} onChange={e => setTone(e.target.value)}>
        <option>Professional</option>
        <option>Excited</option>
        <option>Banter</option>
      </select><br/>
      <label><input type="checkbox" checked={includeHashtags} onChange={() => setIncludeHashtags(!includeHashtags)} /> Include hashtags</label><br/>
      <button onClick={generateUpdate}>Generate Update</button>
      {output && <div><pre>{output}</pre><button onClick={copyToClipboard}>Copy to Clipboard</button></div>}
    </div>
  );
}

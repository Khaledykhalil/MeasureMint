'use client';

import '../../assets/style.css';

async function addSticky() {
  const stickyNote = await miro.board.createStickyNote({
    content: 'MeasureMint 🚀',
  });
  await miro.board.viewport.zoomTo(stickyNote);
}

export default function PanelPage() {
  return (
    <div>
      <h2>MeasureMint Panel</h2>
      <p className="p-small">This panel runs inside a Miro board.</p>
      <ul>
        <li>Click the button below to add a sticky to the board.</li>
        <li>You can customize this panel to add measurement tools next.</li>
      </ul>
      <button type="button" onClick={addSticky} className="button button-primary">
        Add a MeasureMint sticky
      </button>
    </div>
  );
}

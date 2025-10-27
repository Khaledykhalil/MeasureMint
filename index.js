/**
 * MeasureMint - Miro Board Measurement Tool
 * Main entry point for the application
 */

// Load the measurement functionality
import './measuremint.js';

/**
 * Initialize the application
 * Sets up event listeners and UI handlers
 */
async function init() {
  // Enable the 'icon:click' event on the app icon
  await miro.board.ui.on('icon:click', async () => {
    // When the app icon is clicked, open the panel with our UI
    await miro.board.ui.openPanel({
      url: 'app.html',
      title: 'MeasureMint',
      width: 300 // Set a fixed width for the panel
    });
  });

  // Log initialization
  console.log('MeasureMint initialized');
}

// Initialize the app when the window loads
window.addEventListener('load', init);
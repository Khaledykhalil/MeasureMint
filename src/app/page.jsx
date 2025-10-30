import React from 'react'; 

import initMiroAPI from '../utils/initMiroAPI'; 
import '../assets/style.css'; 

const getBoards = async () => {
    try {
        const { miro, userId } = initMiroAPI(); 
        
        // redirect to auth url if user has not authorized the app
        if (!userId || !(await miro.isAuthorized(userId))) { 
            return {
                authUrl: miro.getAuthUrl(), 
            }; 
        } 
        
        const api = miro.as(userId); 
        
        const boards = []; 
        for await (const board of api.getAllBoards()) { 
            boards.push(board); 
        } 
        
        return {
            boards, 
        }; 
    } catch (error) {
        // This is expected when running outside Miro or not authenticated
        console.log('Note: Miro API authentication required for home page. This does not affect the panel functionality.');
        return {
            error: 'API authentication required',
            authUrl: null,
        };
    }
}; 

export default async function Page() {
    const { boards, authUrl, error } = await getBoards(); 
    
    return ( <div> 
      <h3>MeasureMint - Miro Measurement App</h3> 
      <p className="p-small">Professional measurement tools for Miro boards</p> 
      <p> 
        This app runs inside Miro boards. To use MeasureMint:
      </p>
      <ol>
        <li>Install the app in your Miro workspace</li>
        <li>Open any Miro board</li>
        <li>Click the MeasureMint icon in the left toolbar</li>
        <li>Start measuring!</li>
      </ol>
      {error && (
        <div style={{padding: '12px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '6px', marginTop: '12px'}}>
          <p style={{margin: 0, color: '#0c4a6e'}}>
            ℹ️ This page requires Miro API authentication. The MeasureMint panel works independently and doesn't need this.
          </p>
        </div>
      )}
      {authUrl ? ( <a className="button button-primary" href={authUrl} target="_blank"> 
          Login to Miro API
        </a> ) : ( <> 
          <p>This is a list of all the boards that your user has access to:</p> 

          <ul> 
            {boards?.map((board) => ( <li key={board.name}>{board.name}</li> ))} 
          </ul> 
        </> )} 
    </div> ); 
} 

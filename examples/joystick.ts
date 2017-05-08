/* tslint:disable:no-console */
import * as WebSocket from 'ws';

import {
    GameClient,
    IJoystick,
    IJoystickData,
    setWebSocket,
} from '../lib';

if (process.argv.length < 5) {
    console.log('Usage gameClient.exe <token> <url> <experienceId>');
    process.exit();
}
// We need to tell the interactive client what type of websocket we are using.
setWebSocket(WebSocket);

// As we're on the Streamer's side we need a "GameClient" instance
const client = new GameClient();

// Log when we're connected to interactive
client.on('open', () => console.log('Connected to interactive'));

// Now we open the connection passing in our authentication details and an experienceId.
client.open({
    authToken: process.argv[2],
    url: process.argv[3],
    versionId: parseInt(process.argv[4], 10),
});

const joystick: IJoystickData = {
    sampleRate: 50,
    kind: 'joystick',
    controlID: 'joystick1',
    position: [
        {
            size: 'large',
            width: 12,
            height: 12,
            x: 2,
            y: 1,
        },
        {
            size: 'medium',
            width: 12,
            height: 12,
            x: 1,
            y: 0,
        },
        {
            size: 'small',
            width: 12,
            height: 12,
            x: 1,
            y: 0,
        },
    ],
};

// Now we can create the controls, We need to add them to a scene though.
// Every Interactive Experience has a "default" scene so we'll add them there there.
client.createControls({
    sceneID: 'default',
    controls: [joystick],
}).then(controls => {

    // Now that the controls are created we can add some event listeners to them!
    controls.forEach((control: IJoystick) => {

        // move here means that someone has clicked the button.
        control.on('move', (inputEvent, participant) => {

            // Let's tell the user who they are, and where they moved the joystick
            console.log(`${participant.username} moved, ${inputEvent.input.controlID} to ${inputEvent.input.x}, ${inputEvent.input.y}`);
        });
    });
    // Controls don't appear unless we tell Interactive that we are ready!
    client.ready(true);
});
/* tslint:enable:no-console */

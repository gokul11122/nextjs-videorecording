'use client';
import { setup } from '@loomhq/record-sdk';
import { isSupported } from '@loomhq/record-sdk/is-supported';
import { oembed } from '@loomhq/loom-embed';
import { useEffect, useState } from 'react';

const PUBLIC_APP_ID = 'd17a808b-7bec-41c2-a497-5e08f8c21f33';
const BUTTON_ID = 'loom-record-sdk-button';

export default function App() {
    const [videoHTML, setVideoHTML] = useState('');

    useEffect(() => {
        async function setupLoom() {
            const { supported, error } = await isSupported();

            if (!supported) {
                console.warn(`Error setting up Loom: ${error}`);
                return;
            }

            const button = document.getElementById(BUTTON_ID);

            if (!button) {
                return;
            }
            const config = { allowedRecordingTypes: 'cam', defaultRecordingType: 'cam' };
            const { configureButton } = await setup({
                publicAppId: PUBLIC_APP_ID,
                config,
            });

            const sdkButton = configureButton({ element: button });

            sdkButton.on('insert-click', async (video) => {
                const { html } = await oembed(video.sharedUrl, { width: 400 });
                setVideoHTML(html);
            });
        }

        setupLoom();
    }, []);

    return (
        <>
            <button id={BUTTON_ID}>Record</button>
            <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>
        </>
    );
}

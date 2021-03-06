// We've proven we can console.log from a promise then() callback in the bg script.

/**
 * Connect a dev panel, at its request, to the content script in its inspected
 * tab.
 */
function connectADevPanel(port) {
    // Open a port to our content script on the tab that's being inspected.
    port.onMessage.addListener(handleMessage);
    /**
     * Handle any of the various messages that can come flying at the
     * background script from various sources.
     */
    async function handleMessage(request) {
        if (request.type === 'label') {
            // console.log('Sending one-off message to tab', request.tabId);
            const stuff = await browser.tabs.sendMessage(request.tabId, request);
            // console.log('Received stuff from content script:', stuff);
            // Then send via the port to devpanel.
        } else if (request.type === 'freeze') {
            const html = await browser.tabs.sendMessage(
                request.tabId,
                {type: 'freeze',
                 inspectedElement: request.inspectedElement,
                 options: request.options});
            download(html, {saveAs: true});
        } else if (request.type === 'showHighlight') {
            browser.tabs.sendMessage(
                request.tabId,
                {type: 'showHighlight',
                 inspectedElement: request.inspectedElement});
        } else if (request.type === 'hideHighlight') {
            browser.tabs.sendMessage(request.tabId, {type: 'hideHighlight'});
        }
    }
}
browser.runtime.onConnect.addListener(connectADevPanel);

// Use tabs.connect() and runtime.onConnect to connect from here to a content script.

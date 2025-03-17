// Get the base URL for your application
const getBaseUrl = () => {
    // This returns the protocol, hostname, and port
    return window.location.origin;
}

export async function loadComponents(componentName, target) {
    try {
        const baseUrl = getBaseUrl();
        console.log(baseUrl)
        const response = await fetch(`${baseUrl}/components/${componentName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch component: ${componentName} ${response.status}`);
        }
        const html = await response.text();
        target.innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

async function generateContent() {
    const button = document.querySelector('.generate-btn');
    const spinner = document.querySelector('.loading-spinner');
    
    button.disabled = true;
    spinner.style.display = 'block';

    const contentType = document.getElementById('contentType').value;
    const tone = document.getElementById('tone').value;
    const topic = document.getElementById('topic').value;
    const length = document.getElementById('length').value;
    const audience = document.getElementById('audience').value;

    // Construct prompt for Gemini
    const prompt = `Generate a ${contentType} about ${topic}. 
        Tone should be ${tone}. Length should be ${length}.
        Target audience is ${audience}.
        Return the response in markdown format.`;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDpGPNGM-gA3y8JoKh4UOMfv2LQOV4vXag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        const markdownContent = data.candidates[0].content.parts[0].text;

        // Convert markdown to HTML
        const converter = new showdown.Converter();
        let formattedContent = converter.makeHtml(markdownContent);
        
        // Additional formatting for specific content types
        if (contentType === 'formal-letter' || contentType === 'email') {
            formattedContent = formattedContent.replace(/\n/g, '<br>');
        }
        
        document.getElementById('content-output').innerHTML = formattedContent;
        
        // Add copy button (keeps original markdown)
        const copyButton = document.createElement('button');
        copyButton.innerHTML = 'Copy to Clipboard';
        copyButton.className = 'copy-btn';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(markdownContent);
            copyButton.innerHTML = 'Copied!';
            setTimeout(() => {
                copyButton.innerHTML = 'Copy to Clipboard';
            }, 2000);
        };
        document.getElementById('content-output').appendChild(copyButton);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('content-output').innerHTML = 
            '<p class="error">Sorry, there was an error generating your content. Please try again.</p>';
    } finally {
        button.disabled = false;
        spinner.style.display = 'none';
    }
}
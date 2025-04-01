document.addEventListener('DOMContentLoaded', function() {
    // Download button functionality
    const downloadBtn = document.getElementById('download-btn');
    
    downloadBtn.addEventListener('click', function() {
        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = 'Cat-Tab.zip'; // This should be the path to your ZIP file
        link.download = 'Cat-Tab.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // You would typically replace this with actual download logic
        console.log('Download initiated - in a real implementation, this would download the ZIP');
        
        // Show a confirmation message
        alert('Download started! Please check your downloads folder.');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
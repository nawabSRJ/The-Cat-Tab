document.addEventListener('DOMContentLoaded', function() {
            // Download button functionality
            const downloadBtn = document.getElementById('download-btn');
            const downloadBtn2 = document.getElementById('download-btn-2');
            
            function handleDownload() {
                // Create a temporary link to trigger the download
                const link = document.createElement('a');
                link.href = 'Cat-Tab.zip';
                link.download = 'Cat-Tab.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Update download count (simulated)
                incrementCounter('download-count', 17972);
                
                // Show a confirmation message
                alert('Download started! Please check your downloads folder.');
            }
            
            downloadBtn.addEventListener('click', handleDownload);
            downloadBtn2.addEventListener('click', handleDownload);

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
            
            // Animated counters
            function incrementCounter(elementId, finalNumber) {
                const element = document.getElementById(elementId);
                const duration = 2000; // 2 seconds
                const start = parseInt(element.textContent) || 0;
                const increment = finalNumber / (duration / 16); // 60fps
                let current = start;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        clearInterval(timer);
                        current = finalNumber;
                    }
                    element.textContent = Math.floor(current).toLocaleString();
                }, 16);
            }
            
            // Initialize counters
            incrementCounter('download-count', 10);
            incrementCounter('github-stars', 2); // Replace with actual GitHub stars
        });
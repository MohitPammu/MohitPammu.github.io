// Skills Network Visualization using D3.js
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the skills section to be visible before initializing
    const skillsSection = document.getElementById('skills-network');
    
    // If the skills network container doesn't exist, don't initialize
    if (!skillsSection) return;
    
    // Initialize the network visualization
    initSkillsNetwork();
    
    // Listen for theme changes
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            // Redraw the visualization with new theme colors
            setTimeout(initSkillsNetwork, 300); // Small delay to let theme change apply
        });
    }
    
    // Listen for window resize events to make the visualization responsive
    window.addEventListener('resize', function() {
        // Debounce the resize event to avoid excessive redraws
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(initSkillsNetwork, 250);
    });
    
    // Main function to initialize and draw the skills network
    function initSkillsNetwork() {
        // Clear any existing visualization
        const skillsContainer = document.getElementById('skills-network');
        skillsContainer.innerHTML = '';
        
        // Get container dimensions
        const containerWidth = skillsContainer.clientWidth;
        const width = Math.min(containerWidth, 700); // Max width of 700px
        const height = width * 0.8; // Height proportional to width
        
        // Create SVG element
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width/2, -height/2, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 12px 'Poppins', sans-serif;");
        
        // Define data - skills categorized
        const data = {
            nodes: [
                // Programming Languages
                { id: "Python", group: 1, size: 25, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                { id: "R", group: 1, size: 20, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
                { id: "SQL", group: 1, size: 22, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
                { id: "JavaScript", group: 1, size: 18, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
                
                // Data Science Libraries
                { id: "NumPy", group: 2, size: 20, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
                { id: "Pandas", group: 2, size: 22, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
                { id: "Scikit-learn", group: 2, size: 22 },
                { id: "TensorFlow", group: 2, size: 24, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
                { id: "Keras", group: 2, size: 18 },
                
                // Visualization
                { id: "Matplotlib", group: 3, size: 18 },
                { id: "Seaborn", group: 3, size: 16 },
                { id: "Power BI", group: 3, size: 23 },
                { id: "Tableau", group: 3, size: 20 },
                
                // ML/AI
                { id: "Machine Learning", group: 4, size: 25 },
                { id: "Deep Learning", group: 4, size: 23 },
                { id: "Neural Networks", group: 4, size: 20 },
                { id: "Computer Vision", group: 4, size: 19 },
                { id: "NLP", group: 4, size: 18 },
                
                // Tools
                { id: "Git", group: 5, size: 17, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
                { id: "Jupyter", group: 5, size: 22, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
                { id: "Docker", group: 5, size: 16, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" }
            ],
            links: [
                // Python connections
                { source: "Python", target: "NumPy", value: 5 },
                { source: "Python", target: "Pandas", value: 5 },
                { source: "Python", target: "Scikit-learn", value: 4 },
                { source: "Python", target: "TensorFlow", value: 4 },
                { source: "Python", target: "Keras", value: 3 },
                { source: "Python", target: "Matplotlib", value: 4 },
                { source: "Python", target: "Seaborn", value: 3 },
                { source: "Python", target: "Machine Learning", value: 5 },
                { source: "Python", target: "Deep Learning", value: 4 },
                { source: "Python", target: "Jupyter", value: 5 },
                
                // R connections
                { source: "R", target: "Machine Learning", value: 3 },
                { source: "R", target: "Tableau", value: 2 },
                
                // SQL connections
                { source: "SQL", target: "Pandas", value: 3 },
                { source: "SQL", target: "Power BI", value: 4 },
                
                // ML connections
                { source: "Machine Learning", target: "Scikit-learn", value: 5 },
                { source: "Machine Learning", target: "Deep Learning", value: 4 },
                { source: "Deep Learning", target: "TensorFlow", value: 5 },
                { source: "Deep Learning", target: "Keras", value: 4 },
                { source: "Deep Learning", target: "Neural Networks", value: 5 },
                { source: "Neural Networks", target: "Computer Vision", value: 3 },
                { source: "Neural Networks", target: "NLP", value: 3 },
                
                // Visualization connections
                { source: "Pandas", target: "Matplotlib", value: 4 },
                { source: "Pandas", target: "Seaborn", value: 4 },
                { source: "NumPy", target: "Matplotlib", value: 3 },
                
                // Tools connections
                { source: "Jupyter", target: "NumPy", value: 3 },
                { source: "Jupyter", target: "Pandas", value: 3 },
                { source: "Git", target: "Python", value: 2 },
                { source: "Git", target: "Docker", value: 2 }
            ]
        };
        
        // Get theme colors based on current theme
        function getThemeColor(index) {
            const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
            // Use your website's color variables
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            
            // Define color palettes for light and dark themes
            // You can customize these colors to match your site's palette
            const lightColors = [
                primaryColor,           // Primary color for group 1
                "#f45d48",             // For group 2
                "#ffd166",             // For group 3
                "#06d6a0",             // For group 4
                "#118ab2"              // For group 5
            ];
            
            const darkColors = [
                primaryColor,           // Primary color for group 1
                "#ff7c5c",             // For group 2
                "#ffe066",             // For group 3
                "#2ce1b5",             // For group 4
                "#25c4f3"              // For group 5
            ];
            
            return isDarkTheme ? darkColors[index] : lightColors[index];
        }
        
        // Get text color based on theme
        function getTextColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        }
        
        // Get background color based on theme
        function getBackgroundColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim();
        }
        
        // Get section background color based on theme
        function getSectionBackgroundColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--section-bg').trim();
        }
        
        // Create force simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => 200 - d.value * 20))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(0, 0))
            .force("collide", d3.forceCollide().radius(d => d.size * 1.5));
        
        // Create links
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));
        
        // Create node containers
        const node = svg.append("g")
            .selectAll(".node")
            .data(data.nodes)
            .join("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        // Add circles to each node
        node.append("circle")
            .attr("r", d => d.size)
            .attr("fill", d => getThemeColor(d.group - 1))
            .attr("stroke", getBackgroundColor())
            .attr("stroke-width", 1.5);
        
        // Add icons for nodes that have them
        node.filter(d => d.icon)
            .append("svg:image")
            .attr("xlink:href", d => d.icon)
            .attr("x", d => -d.size * 0.7)
            .attr("y", d => -d.size * 0.7)
            .attr("width", d => d.size * 1.4)
            .attr("height", d => d.size * 1.4);
        
        // Add text labels
        node.append("text")
            .attr("dx", d => d.size + 6)
            .attr("dy", ".35em")
            .attr("font-size", d => Math.max(12, d.size * 0.5))
            .text(d => d.id)
            .attr("fill", getTextColor())
            .attr("stroke", getBackgroundColor())
            .attr("stroke-width", 2)
            .attr("paint-order", "stroke");
        
// Create hover effects
node
    .on("mouseover", function(event, d) {
        // Get the primary color for highlighting
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        
        d3.select(this).select("circle")
            .transition()
            .duration(300)
            .attr("r", d.size * 1.2);
        
        d3.select(this).select("text")
            .transition()
            .duration(300)
            .attr("font-size", Math.max(14, d.size * 0.6))
            .attr("font-weight", "bold");
            
        // Highlight connected nodes
        const connectedLinks = data.links.filter(link => 
            (link.source.id === d.id || link.target.id === d.id) ||
            (link.source === d.id || link.target === d.id)
        );
        
        const connectedNodeIds = new Set();
        connectedLinks.forEach(link => {
            if (link.source.id) {
                connectedNodeIds.add(link.source.id);
            } else if (typeof link.source === 'string') {
                connectedNodeIds.add(link.source);
            }
            
            if (link.target.id) {
                connectedNodeIds.add(link.target.id);
            } else if (typeof link.target === 'string') {
                connectedNodeIds.add(link.target);
            }
        });
        
        // Highlight connected nodes
        node.filter(node => connectedNodeIds.has(node.id) && node.id !== d.id)
            .select("circle")
            .transition()
            .duration(300)
            .attr("stroke", primaryColor)
            .attr("stroke-width", 3);
            
        // Highlight connected links
        link.filter(link => 
            (link.source.id === d.id || link.target.id === d.id) ||
            (link.source === d.id || link.target === d.id)
        )
            .transition()
            .duration(300)
            .attr("stroke", primaryColor)
            .attr("stroke-width", d => Math.sqrt(d.value) * 2)
            .attr("stroke-opacity", 1);
    })
    .on("mouseout", function(event, d) {
        d3.select(this).select("circle")
            .transition()
            .duration(300)
            .attr("r", d.size);
            
        d3.select(this).select("text")
            .transition()
            .duration(300)
            .attr("font-size", Math.max(12, d.size * 0.5))
            .attr("font-weight", "normal");
            
        // Reset connected nodes
        node.select("circle")
            .transition()
            .duration(300)
            .attr("stroke", getBackgroundColor())
            .attr("stroke-width", 1.5);
            
        // Reset links
        link
            .transition()
            .duration(300)
            .attr("stroke", "#999")
            .attr("stroke-width", d => Math.sqrt(d.value))
            .attr("stroke-opacity", 0.6);
    });
        
        // Setup simulation ticks
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            
            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });
        
        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        // Add legend
        const legendData = [
            { name: "Programming Languages", color: getThemeColor(0) },
            { name: "Data Science Libraries", color: getThemeColor(1) },
            { name: "Visualization", color: getThemeColor(2) },
            { name: "ML/AI", color: getThemeColor(3) },
            { name: "Tools", color: getThemeColor(4) }
        ];
        
        const legend = svg.append("g")
            .attr("transform", `translate(${-width/2 + 20},${-height/2 + 20})`);
            
        legend.selectAll("rect")
            .data(legendData)
            .join("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 25)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => d.color);
            
        legend.selectAll("text")
            .data(legendData)
            .join("text")
            .attr("x", 25)
            .attr("y", (d, i) => i * 25 + 12.5)
            .text(d => d.name)
            .attr("fill", getTextColor())
            .attr("stroke", getBackgroundColor())
            .attr("stroke-width", 0.3)
            .attr("paint-order", "stroke");
        
        // Append the SVG to the container
        skillsContainer.appendChild(svg.node());
        
        // Add instruction text
        const instructionP = document.createElement('p');
        instructionP.className = 'skills-hint';
        instructionP.textContent = 'Hover over skills to see connections. Drag nodes to rearrange.';
        instructionP.style.textAlign = 'center';
        instructionP.style.fontSize = '0.9rem';
        instructionP.style.marginTop = '1rem';
        instructionP.style.color = getTextColor();
        skillsContainer.appendChild(instructionP);
    }
});

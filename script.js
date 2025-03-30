document.getElementById("search-btn").addEventListener("click", async () => {
    const searchQuery = document.getElementById("searchInput").value.trim();

    if (!searchQuery) {
        alert("Please enter a college name to search.");
        return;
    }

    const apiUrl = `https://college-finder-g64v.onrender.com/search_college?name=${encodeURIComponent(searchQuery)}`;

    try {
        const response = await fetch(apiUrl);
        
        // ✅ Check if the response is OK (status 200)
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log("🔍 Search Response:", data); // ✅ Debugging log

        if (Array.isArray(data) && data.length > 0) {
            // ✅ If multiple results, use the first one
            window.location.href = `college.html?id=${data[0].id}`;
        } else {
            alert("College not found. Please try again.");
        }

    } catch (error) {
        console.error("❌ Error searching for college:", error);
        alert("An error occurred while searching. Please try again later.");
    }
});









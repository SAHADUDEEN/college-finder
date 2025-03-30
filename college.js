document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const collegeId = urlParams.get("id");

    if (collegeId) {
        fetchCollegeDetails(collegeId);
        fetchCourses(collegeId);
    } else {
        document.getElementById("collegeName").textContent = "Invalid College ID!";
    }
});

// ✅ Base API URL (Render Deployment)
const API_BASE_URL = "https://college-finder-g64v.onrender.com ";

// ✅ Fetch and display college details
async function fetchCollegeDetails(collegeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/colleges/${collegeId}`);
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 College Data:", data); // Debugging

        if (data.id) {
            document.getElementById("collegeName").textContent = data.name;
            document.getElementById("collegeInfo").innerHTML = `
                <strong>1. Location:</strong> ${data.location || "N/A"}<br>
                <strong>2. Ranking:</strong> ${data.ranking || "N/A"}<br>
                <strong>3. Type:</strong> ${data.type || "N/A"}<br>
                <strong>4. Website:</strong> <a href="${data.website || "#"}" target="_blank">${data.website || "Not Available"}</a>
            `;

            // ✅ Display the college image if available
            const collegeImage = document.getElementById("collegeImage");
            if (data.image_url) {
                collegeImage.src = data.image_url;
                collegeImage.style.display = "block";
            } else {
                collegeImage.style.display = "none"; // Hide image if no URL
            }

        } else {
            displayError("College not found!");
        }
    } catch (error) {
        console.error("❌ Error fetching college details:", error);
        displayError("Unable to load college details. Please try again.");
    }
}

// ✅ Fetch and display courses inside the table
async function fetchCourses(collegeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses?college_id=${collegeId}`);

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 Courses Data:", data); // Debugging

        const courseTable = document.getElementById("courseTable");
        const courseTableBody = document.querySelector("#courseTable tbody");
        const noCoursesMessage = document.getElementById("noCoursesMessage");

        courseTableBody.innerHTML = ""; // ✅ Clear existing data

        if (!Array.isArray(data) || data.length === 0) {
            courseTable.style.display = "none"; // ✅ Hide table
            noCoursesMessage.style.display = "block";
        } else {
            courseTable.style.display = "table"; // ✅ Show table
            noCoursesMessage.style.display = "none";

            data.forEach(course => {
                const row = document.createElement("tr");

                // ✅ Convert list_of_courses (comma-separated) into an ordered list
                let courseListHTML = "<ul>";
                if (course.list_of_courses) {
                    course.list_of_courses.split(",").forEach(c => {
                        courseListHTML += `<li>${c.trim()}</li>`;
                    });
                } else {
                    courseListHTML += "<li>No courses listed</li>";
                }
                courseListHTML += "</ul>";

                row.innerHTML = `
                    <td>${course.name || "N/A"}</td>
                    <td>${courseListHTML}</td>
                    <td>₹${course.fees || "N/A"}</td>
                    <td>${course.eligibility || "N/A"}</td>
                `;
                courseTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        displayError("Unable to load courses. Please try again.");
    }
}

// ✅ Display an error message
function displayError(message) {
    document.getElementById("collegeName").textContent = message;
    document.getElementById("collegeInfo").innerHTML = "";
    document.getElementById("collegeImage").style.display = "none";
    document.getElementById("courseTable").style.display = "none";
    document.getElementById("noCoursesMessage").style.display = "block";
}






 
 
 
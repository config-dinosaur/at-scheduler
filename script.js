document.addEventListener('DOMContentLoaded', function() {
    const jobTableBody = document.querySelector('#job-table tbody');
    const addJobButton = document.getElementById('add-job-btn');
    const modal = document.getElementById('add-job-modal');
    const closeModal = modal.querySelector('.close');
    const submitJobButton = document.getElementById('submit-job');
    const currentDateTimeElem = document.getElementById('current-date-time');
    const timezoneElem = document.getElementById('timezone'); // Element to display timezone

    const fetchJobs = async () => {
        const response = await fetch('/get-jobs');
        const jobs = await response.json();
        jobTableBody.innerHTML = ''; // Clear existing rows
        jobs.forEach(job => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${job.job_number}</td>
            <td>${job.command}</td>
            <td>${formatDate(job.time)}</td>  <!-- Format adjustment here -->
            <td><button id="remove-btn" class="remove-btn" data-job-number="${job.job_number}">Remove</button></td>
            `;
            jobTableBody.appendChild(row);
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        if (isNaN(date)) {
            return "Invalid Date";  // Check for NaN
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;  // Formatting date time to 'YYYY-MM-DD HH:MM'
    };

    const updateCurrentDateTime = async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        // Format to 'YYYY-MM-DD HH:MM:SS'
        currentDateTimeElem.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fetchTimezone = async () => {
        const response = await fetch('/timezone');
        const data = await response.json();
        if (data.timezone) {
            timezoneElem.textContent = `Time Zone: ${data.timezone}`;
        } else {
            timezoneElem.textContent = "Error fetching time zone";
        }
    };

    const addJob = async (command, scheduledTime) => {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command: command, time: scheduledTime })
        });
        return await response.json();
    };

    addJobButton.onclick = () => {
        modal.style.display = 'block';
    };

    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    submitJobButton.onclick = async () => {
        const command = document.getElementById('job-command').value;
        const scheduledTime = document.getElementById('job-time').value;

        if (!command || !scheduledTime) {
            alert("Both command and scheduled time must be provided.");
            return;
        }

        const scheduledDate = new Date(scheduledTime);
        const hours = String(scheduledDate.getHours()).padStart(2, '0');
        const minutes = String(scheduledDate.getMinutes()).padStart(2, '0');
        const day = String(scheduledDate.getDate()).padStart(2, '0');
        const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
        const year = scheduledDate.getFullYear();

        const timeString = `${hours}:${minutes} ${day}.${month}.${year}`;

        const result = await addJob(command, timeString);
        if (result.message) {
            alert(result.message);
            modal.style.display = 'none';
            fetchJobs();
        } else {
            alert(result.error);
        }
    };

    jobTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const jobNumber = e.target.dataset.jobNumber;

            // Show confirmation dialog
            const confirmRemoval = confirm(`Are you sure you want to remove job number ${jobNumber}?`);

            if (confirmRemoval) {
                await fetch(`/remove/${jobNumber}`, { method: 'DELETE' });
                fetchJobs();
            }
        }
    });

    // Update current date and time every second
    setInterval(updateCurrentDateTime, 1000);

    // Initial fetch of jobs, current time display, and timezone setup
    fetchJobs();
    updateCurrentDateTime(); // Initial call to set the date and time right away
    fetchTimezone(); // Fetch the timezone
});

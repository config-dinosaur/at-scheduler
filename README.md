# Job Scheduler Docker image using Flask

A simple job scheduling application using Flask and the `at` command. This application allows users to schedule commands to run at specific times, view pending jobs, and manage their scheduled tasks via a web interface or APIs.

## Features

- **Schedule Jobs**: Add jobs with specific commands that will execute at a scheduled time.
- **View Pending Jobs**: Retrieve a list of all currently scheduled jobs with their execution times.
- **Remove Jobs**: Delete scheduled jobs as needed.
- **Timezone Information**: Display the server's current timezone.

## Technologies Used

- **Flask**: A lightweight WSGI web application framework for Python.
- **at Command**: Used for scheduling jobs on Unix-like operating systems.
- **HTML/CSS/JavaScript**: For the frontend interface.

## API Endpoints

<table>
    <thead>
        <tr>
            <th>Endpoint</th>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>/</td>
            <td>GET</td>
            <td>Serves the main HTML page.</td>
        </tr>
        <tr>
            <td>/add</td>
            <td>POST</td>
            <td>Schedules a job with a command and time.</td>
        </tr>
        <tr>
            <td>/get-jobs</td>
            <td>GET</td>
            <td>Retrieves a list of pending jobs.</td>
        </tr>
        <tr>
            <td>/remove/&lt;job_number&gt;</td>
            <td>DELETE</td>
            <td>Removes a scheduled job.</td>
        </tr>
        <tr>
            <td>/timezone</td>
            <td>GET</td>
            <td>Retrieves the server's timezone.</td>
        </tr>
    </tbody>
</table>

## Docker image
https://hub.docker.com/r/configdinosaur/at-scheduler

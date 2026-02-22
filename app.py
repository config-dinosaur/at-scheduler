from flask import Flask, request, jsonify, send_from_directory
import logging
import subprocess

app = Flask(__name__, static_url_path='', static_folder='static')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    logger.info("Serving the main HTML page.")
    return send_from_directory('static', 'index.html')

@app.route('/schedule', methods=['POST'])
def schedule_job():
    job = request.json.get('job')
    time = request.json.get('time')  # e.g., "now + 1 minute"

    if not job or not time:
        logger.warning("Job and time are required.")
        return jsonify({"error": "Job and time are required"}), 400

    # Schedule the job using `at`
    command = f'echo "{job}" | at {time}'
    try:
        subprocess.run(command, shell=True, check=True)
        logger.info("Job scheduled successfully.")
        return jsonify({"message": "Job scheduled successfully"}), 200
    except subprocess.CalledProcessError as e:
        logger.error(f"Error scheduling job: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/jobs', methods=['GET'])
def get_pending_jobs():
    try:
        # Run the atq command to get the list of jobs
        result = subprocess.run(['atq'], text=True, capture_output=True, check=True)
        jobs = result.stdout.strip().split('\n') if result.stdout.strip() else []

        commands_list = []
        for job in jobs:
            parts = job.split()
            if len(parts) >= 5:
                job_number = parts[0]
                time_info = ' '.join(parts[1:5])

                scheduled_time = time_info.replace(" ", ", ", 1)
                formatted_time = subprocess.run(
                    ['date', '-d', scheduled_time, '+%Y-%m-%d %H:%M'],
                    text=True,
                    capture_output=True
                )
                formatted_time_str = formatted_time.stdout.strip() if formatted_time.stdout.strip() else time_info

                command_output = subprocess.run(['at', '-c', job_number], text=True, capture_output=True)
                scheduled_command = command_output.stdout.strip().split('\n')[-1] if command_output.stdout.strip() else ""

                commands_list.append({
                    "job_number": job_number,
                    "command": scheduled_command,
                    "time": formatted_time_str
                })

        logger.info("Fetched pending jobs successfully.")
        return jsonify(commands_list), 200
    except subprocess.CalledProcessError as e:
        logger.error(f"Error fetching jobs: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/remove/<job_number>', methods=['DELETE'])
def remove_job(job_number):
    try:
        subprocess.run(['atrm', job_number], check=True)
        logger.info(f"Job {job_number} removed successfully.")
        return jsonify({"message": f"Job {job_number} removed successfully."}), 200
    except subprocess.CalledProcessError as e:
        logger.error(f"Error removing job {job_number}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/timezone', methods=['GET'])
def get_timezone():
    try:
        result = subprocess.run(['date', '+%Z'], text=True, capture_output=True, check=True)
        timezone = result.stdout.strip()
        logger.info("Fetched timezone successfully.")
        return jsonify({"timezone": timezone}), 200
    except subprocess.CalledProcessError as e:
        logger.error(f"Error fetching timezone: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7007)

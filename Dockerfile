FROM ubuntu:latest

ARG TIMEZONE=UTC

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl python3 python3-pip python3-venv at tzdata && \
    ln -snf /usr/share/zoneinfo/$TIMEZONE /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean

ENV TZ=UTC

RUN python3 -m venv /venv
RUN /venv/bin/pip install --upgrade pip
RUN /venv/bin/pip install --no-cache-dir Flask

COPY index.html /static/index.html
COPY styles.css /static/styles.css
COPY script.js /static/script.js

# Set the path for the virtual environment so that it can be used in CMD
ENV PATH="/venv/bin:$PATH"

# Copy the Flask application code into the container
COPY app.py /app.py

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

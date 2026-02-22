#!/bin/bash
touch /var/spool/cron/atjobs/.SEQ
chown daemon:daemon /var/spool/cron/atjobs/.SEQ
chmod 600 /var/spool/cron/atjobs/.SEQ
service atd start
exec python3 /app.py

#!/usr/bin/env python3

""" 
    requires: 
    1. flask=*,
    2. dkimpy=*
    (same must be specified in requirements.txt)
"""

"""
    the following environment variable must be set:
    1. SMTP_HOST: Hostname of the SMTP server (must support TLS)
    2. SMTP_PORT: Port number of the SMTP server (must support TLS)
    3. SMTP_USERNAME: Username to login to the SMTP server
    4. SMTP_PASSWORD: Password to login to the SMTP server
    5. FROM_ADDRESS: Email address of the sender
    6. FROM_NAME: Name of the sender
    7. REPLY_TO_ADDRESS: Email address whom the recepient will revert
    8. DKIM_SELECTOR: Selector key for DKIM
    9. DKIM_DOMAIN: Domain name for DKIM
"""


import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import dkim

from flask import jsonify, make_response

import os

# fetch the required configuration
# from the preset environment variables
SMTP_HOST = os.environ['SMTP_HOST']
SMTP_PORT = int(os.environ['SMTP_PORT'])

USERNAME = os.environ['SMTP_USERNAME']
PASSWORD = os.environ['SMTP_PASSWORD']

FROM_ADDRESS = os.environ['FROM_ADDRESS']
FROM_NAME = os.environ['FROM_NAME']
REPLY_TO_ADDRESS = os.environ['REPLY_TO_ADDRESS']

PRIVATE_KEY = open('private_key.pem').read()

DKIM_SELECTOR = os.environ['DKIM_SELECTOR']
DKIM_DOMAIN = os.environ['DKIM_DOMAIN']

def send_email(to_email, subject, body):
    """
        Will send an email to the specified address 
        with given subject and body
    """
    try:
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
        server.login(USERNAME, PASSWORD)

        message = MIMEMultipart()
        message['To'] = to_email
        message['From'] = '%s <%s>' % (FROM_NAME, FROM_ADDRESS)
        message['Reply-To'] = REPLY_TO_ADDRESS
        message['Subject'] = subject

        message.attach(MIMEText(body, 'plain'))

        signature = dkim.sign(message.as_bytes(), DKIM_SELECTOR.encode(), DKIM_DOMAIN.encode(), PRIVATE_KEY.encode()).decode()
        signature = signature.lstrip("DKIM-Signature: ")
        message['DKIM-Signature'] = signature

        # send the message
        server.sendmail(FROM_ADDRESS, to_email, message.as_string())
        server.quit()
    except Exception as err:
        return {
            'success': False,
            'err': str(err)
        }
    else:
        return {
            'success': True,
        }

def serve_request(request):
    """
        Will serve a GCP Cloud Function to send
        email based on received trigger json
    """
    try:
        api_input = request.get_json()
        api_output = send_email(api_input['to'], api_input['subject'], api_input['body'])
    except:
        return make_response(jsonify({}), 200)
    else:
        return make_response(jsonify(api_output), 200)

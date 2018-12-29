FROM python:3
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# Bundle app source
COPY . .
# Expose the binded port
EXPOSE 8080
# Run the application
CMD ["gunicorn", "-b", ":8080", "main:app"]

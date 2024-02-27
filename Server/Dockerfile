FROM python:alpine
WORKDIR /Server
COPY . .
RUN pip3 install -r requirements.txt
EXPOSE 8080
CMD ["python3", "app.py"]
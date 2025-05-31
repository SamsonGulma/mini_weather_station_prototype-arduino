
### === Python Serial Reader + Flask API (app.py) ===
from flask import Flask, jsonify, render_template
import serial
import threading
import time

app = Flask(__name__)

ser = serial.Serial('COM3', 9600)  # Update COM port if needed
latest_data = {'temp': 0, 'hum': 0, 'light': 0, 'motion': 0}


def read_serial():
    global latest_data
    while True:
        try:
            line = ser.readline().decode('utf-8').strip()
            values = line.split(',')
            if len(values) == 4:
                latest_data = {
                    'temp': float(values[0]),
                    'hum': float(values[1]),
                    'light': int(values[2]),
                    'motion': int(values[3])
                }
        except:
            continue


@app.route('/data')
def get_data():
    return jsonify(latest_data)


@app.route('/')
def dashboard():
    return render_template('dashboard.html')


if __name__ == '__main__':
    t = threading.Thread(target=read_serial)
    t.daemon = True
    t.start()
    app.run(debug=True)


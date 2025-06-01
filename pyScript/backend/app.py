
from flask import Flask, jsonify, render_template, request, session, send_file
import serial
import threading
import time
import csv
import io

app = Flask(__name__)
app.secret_key = 'weatherstation123'

ser = serial.Serial('/dev/ttyUSB0', 9600)
latest_data = {'temp': 0, 'hum': 0, 'light': 0}
history = []

ALERT_THRESHOLDS = {
    'temp': 30.0,
    'hum': 80.0,   
    'light': 800   
}

alerts = []

def read_serial():
    global latest_data, history, alerts
    while True:
        try:
            line = ser.readline().decode('utf-8').strip()
            values = line.split(',')
            if len(values) == 3:
                latest_data = {
                    'temp': float(values[0]),
                    'hum': float(values[1]),
                    'light': int(values[2])
                }
                entry = {
                    'time': time.strftime("%H:%M:%S"),
                    **latest_data
                }
                history.append(entry)
                if len(history) > 100:
                    history.pop(0)

                # Add alerts
                for key in ['temp', 'hum', 'light']:
                    if latest_data[key] > ALERT_THRESHOLDS[key]:
                        alerts.append({
                            'type': key,
                            'value': latest_data[key],
                            'time': entry['time']
                        })
                        if len(alerts) > 50:
                            alerts.pop(0)
        except:
            continue

@app.route('/data')
def get_data():
    return jsonify(latest_data)

@app.route('/history')
def get_history():
    return jsonify(history)

@app.route('/export')
def export_csv():
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=['time', 'temp', 'hum', 'light'])
    writer.writeheader()
    writer.writerows(history)
    output.seek(0)
    return send_file(io.BytesIO(output.getvalue().encode()),
                     mimetype='text/csv',
                     download_name='weather_data.csv',
                     as_attachment=True)

@app.route('/alerts')
def get_alerts():
    return jsonify(alerts)

@app.route('/thresholds', methods=['GET', 'POST'])
def manage_thresholds():
    global ALERT_THRESHOLDS
    if request.method == 'POST':
        data = request.json
        for key in ['temp', 'hum', 'light']:
            if key in data:
                ALERT_THRESHOLDS[key] = float(data[key])
    return jsonify(ALERT_THRESHOLDS)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

if __name__ == '__main__':
    t = threading.Thread(target=read_serial)
    t.daemon = True
    t.start()
    app.run(debug=True)

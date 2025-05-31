from flask import Flask, jsonify, request, send_from_directory, render_template
import os

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')

tasks = []
task_id = 1


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/health')
def health():
    return 'OK', 200

@app.route('/tasks', methods=['GET'])
def list_tasks():
    return jsonify(tasks)


@app.route('/tasks', methods=['POST'])
def create_task():
    global task_id
    data = request.get_json()
    task = {
        'id': task_id,
        'title': data.get('title', 'Untitled Task'),
        'description': data.get('description', ''),  
        'completed': False
    }
    tasks.append(task)
    task_id += 1
    return jsonify(task), 201


@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    for task in tasks:
        if task['id'] == id:
            task['completed'] = request.get_json().get('completed', task['completed'])
            return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404


@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task['id'] != id]
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)

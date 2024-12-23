from flask import Blueprint, request, jsonify
from app.models import BackupJob
from app import db
from datetime import datetime

api = Blueprint('api', __name__)

history = []

@api.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = BackupJob.query.all()
    return jsonify([task.to_dict() for task in tasks])

@api.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_task = BackupJob(name=data['name'], status=data.get('status', 'Added'))
    db.session.add(new_task)
    db.session.commit()
    
    history.append({
        "timestamp": datetime.now().isoformat(),
        "action": f"Task '{new_task.name}' added"
    })
    return jsonify(new_task.to_dict()), 201

@api.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = BackupJob.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        history.append({
            "timestamp": datetime.now().isoformat(),
            "action": f"Task '{task.name}' deleted"
        })
        return jsonify({"message": "Task deleted successfully"}), 200
    else:
        return jsonify({"message": "Task not found"}), 404

@api.route('/api/tasks/<int:id>', methods=['PATCH'])
def update_task_status(id):
    data = request.json
    task = BackupJob.query.get(id)
    if task:
        old_status = task.status
        task.status = data.get('status', task.status)
        db.session.commit()
        history.append({
            "timestamp": datetime.now().isoformat(),
            "action": f"Task '{task.name}' status changed from '{old_status}' to '{task.status}'"
        })
        return jsonify(task.to_dict()), 200
    else:
        return jsonify({"message": "Task not found"}), 404

@api.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(history)

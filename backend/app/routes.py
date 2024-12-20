from flask import Blueprint, request, jsonify
from app.models import BackupJob
from app import db

api = Blueprint('api', __name__)

@api.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = BackupJob.query.all()
    return jsonify([task.to_dict() for task in tasks])

@api.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_task = BackupJob(name=data['name'], status=data.get('status', 'Pending'))
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@api.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = BackupJob.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    else:
        return jsonify({"message": "Task not found"}), 404

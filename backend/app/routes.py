from flask import Blueprint, request, jsonify
from app.models import BackupJob
from apscheduler.triggers.interval import IntervalTrigger
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

@api.route('/api/schedule/<int:id>', methods=['POST'])
def schedule_task(id):
    data = request.json
    task = BackupJob.query.get(id)
    
    if not task:
        return jsonify({"message": "Task not found"}), 404
    
    # Параметры периодичности
    hours = data.get('hours', 0)
    minutes = data.get('minutes', 0)
    seconds = data.get('seconds', 0)
    
    # Добавление задачи в планировщик
    job_id = f"task_{id}"
    scheduler.add_job(
        func=execute_task,
        trigger=IntervalTrigger(hours=hours, minutes=minutes, seconds=seconds),
        id=job_id,
        replace_existing=True,
        args=[id]
    )
    task.status = "Scheduled"
    db.session.commit()
    return jsonify({"message": f"Task '{task.name}' scheduled successfully"}), 200

def execute_task(task_id):
    task = BackupJob.query.get(task_id)
    if task:
        task.status = "Running"
        db.session.commit()
        # Логика выполнения задачи
        task.status = "Completed"
        db.session.commit()

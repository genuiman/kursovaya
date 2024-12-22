from app import db

class BackupJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="Added")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "status": self.status}
import json
from flask import Flask, request, jsonify, abort
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from model.attractions import Attraction

with open('/home/yefym/Desktop/front-end/lab_3-5/backend/secret.json') as f:
    SECRET = json.load(f)

DB_URL = 'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db}'.format(
    user=SECRET['user'],
    password=SECRET['password'],
    host=SECRET['host'],
    port=SECRET['port'],
    db=SECRET['db'])

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)


class AttractionForDB(Attraction, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=False)
    price_of_ticket_in_usd = db.Column(db.Float, unique=False)
    min_age = db.Column(db.Integer, unique=False)

    def __init__(self, id=None, name='N/A', price_of_ticket_in_usd=0, min_age=0):
        super().__init__(name=name, price_of_ticket_in_usd=price_of_ticket_in_usd, min_age=min_age)
        self.id = id


class AttractionSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'price_of_ticket_in_usd', 'min_age')


smart_attraction_schema = AttractionSchema()
smart_attractions_schema = AttractionSchema(many=True)


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    return response


@app.route('/attraction', methods=['POST'])
def add_attraction():
    attraction = AttractionForDB(
        name=request.json['name'],
        price_of_ticket_in_usd=request.json['price_of_ticket_in_usd'],
        min_age=request.json['min_age']
    )
    db.session.add(attraction)
    db.session.commit()
    return smart_attraction_schema.jsonify(attraction)


@app.route('/attraction', methods=['GET'])
def get_attraction():
    all_abstract_attraction = AttractionForDB.query.all()
    result = smart_attractions_schema.dump(all_abstract_attraction)
    return jsonify(result)


@app.route('/attraction/<id>', methods=['GET'])
def get_attraction_by_id(id):
    attraction = AttractionForDB.query.get(id)
    if not attraction:
        abort(404)
    return smart_attraction_schema.jsonify(attraction)


@app.route('/attraction/<id>', methods=['PUT'])
def update_attraction_by_id(id):
    attraction = AttractionForDB.query.get(id)
    if not attraction:
        abort(404)
    attraction.name = request.json['name']
    attraction.price_of_ticket_in_usd = request.json['price_of_ticket_in_usd']
    attraction.min_age = request.json['min_age']
    db.session.commit()
    return smart_attraction_schema.jsonify(attraction)


@app.route('/attraction/<id>', methods=['DELETE'])
def delete_attraction_by_id(id):
    attraction = AttractionForDB.query.get(id)
    if not attraction:
        abort(404)
    db.session.delete(attraction)
    db.session.commit()
    return smart_attraction_schema.jsonify(attraction)


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, host=SECRET['host'], port=5010)

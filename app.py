# import necessary libraries
from sqlalchemy import func
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/yelp_data.sqlite"

db = SQLAlchemy(app)


class Yelp_sf(db.Model):
    __tablename__ = 'yelp_sf'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    rating = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    price = db.Column(db.String)
    categories = db.Column(db.String)
    coordinates = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    def __repr__(self):
        return '<Yelp_sf %r>' % (self.name)

results = db.session.query(Yelp_sf.name, 
        Yelp_sf.location,
        Yelp_sf.rating,
        Yelp_sf.review_count,
        Yelp_sf.price,
        Yelp_sf.categories,
        Yelp_sf.coordinates,
        Yelp_sf.latitude,
        Yelp_sf.longitude)\
        .filter(Yelp_sf.latitude < 37.810200)\
        .filter(Yelp_sf.latitude > 37.698958)\
        .filter(Yelp_sf.longitude > -122.513495)\
        .filter(Yelp_sf.longitude < -122.357598)\
        .filter(Yelp_sf.rating > 2)\
        .all()    

        


        # .filter(Yelp_sf.rating > 3.5)\
        
        

@app.before_first_request
def setup():
    #db.drop_all()
    db.create_all()


# Create a route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")





# Query the database and return the jsonified results
@app.route("/data_json")
def data_json():
    
    data_list = []
    for result in results:
        sample_metadata = {}
        sample_metadata["name"] = result[0]
        sample_metadata["location"] = result[1]
        sample_metadata["rating"] = float(result[2])
        sample_metadata["review_count"] = int(result[3])
        sample_metadata["price"] = result[4]
        sample_metadata["categories"] = result[5]
        sample_metadata["coordinates"] = result[6]
        sample_metadata["latitude"] = float(result[7])
        sample_metadata["longitude"] = float(result[8])
        data_list.append(sample_metadata)        
    data_dict = {"data":data_list}

    return jsonify(data_dict)


@app.route("/data_csv")
def data_csv():

    name = [result[0] for result in results]
    location = [result[1] for result in results]
    rating  = [float(result[2]) for result in results]
    review_count = [int(result[3]) for result in results]
    price = [result[4] for result in results]
    categories = [result[5] for result in results]
    coordinates = [result[6] for result in results]
    latitude = [float(result[7]) for result in results]
    longitude = [float(result[8]) for result in results]

    data_dict = {
        "name":name,
        "location":location,
        "rating":rating,
        "review_count":review_count,
        "price":price,
        "categories":categories,
        "coordinates":coordinates,
        "latitude":latitude,
        "longitude":longitude
    }

    df_csv = pd.DataFrame.from_dict(data_dict)
    return  df_csv.to_csv()


# @app.route("/send", methods=["GET", "POST"])
# def send():
#     if request.method == "POST":
#         result = []
#         result.append(request.form["categories"])
#         result.append(request.form["weight_a"])
#         result.append(request.form["weight_b"])
#         result.append(request.form["regular_or_heat"])
#         return redirect("/", code=302)

#         return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)

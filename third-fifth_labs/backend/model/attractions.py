class Attraction:

    def __init__(self, name, distance_length_in_meters=None, max_speed_in_km_per_hour=None, max_height_in_meters=None,
                 price_of_ticket_in_usd=None, min_age=None):
        self.name = name
        self.distance_length_in_meters = distance_length_in_meters
        self.max_speed_in_km_per_hour = max_speed_in_km_per_hour
        self.max_height_in_meters = max_height_in_meters
        self.price_of_ticket_in_usd = price_of_ticket_in_usd
        self.min_age = min_age

    def __str__(self):
        name = 'Name: {}\n'.format(self.name)
        distance_length_in_meters = 'Distance length in meters: {}\n'.format(self.distance_length_in_meters)
        max_speed_in_km_per_hour = 'Max speed in km/hour: {}\n'.format(self.max_speed_in_km_per_hour)
        max_height_in_meters = 'Max height in meters: {}\n'.format(self.max_height_in_meters)
        price_of_ticket_in_usd = 'Price of ticket in usd: {}\n'.format(self.price_of_ticket_in_usd)
        age_required = 'Min age required: {}\n'.format(self.min_age)
        return name + distance_length_in_meters + max_speed_in_km_per_hour + max_height_in_meters + price_of_ticket_in_usd + age_required
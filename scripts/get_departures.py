import requests
from datetime import datetime
import os
import re
import json

api_key = os.getenv("NAVITIA_API_KEY")


def get_departures(hours, stop_area_code):
    schedule_type = "terminus_schedules"
    url = f"https://api.navitia.io/v1/coverage/sncf/stop_areas/stop_area:SNCF:{stop_area_code}/{schedule_type}"

    headers = {"Authorization": api_key}

    params = {
        "start_page": "0",
        "depth": "0",
        "from_datetime": datetime.now(),
        "duration": str(hours * 60 * 60),
        "disable_geojson": "true",
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    response_data = response.json()

    map_labels = {"R": "R", "P35": "D"}
    pattern = re.compile(r"\s*\([^)]*\)")

    for schedule in response_data[schedule_type]:
        informations = schedule["display_informations"]

        for date in schedule["date_times"]:
            date_time = datetime.fromisoformat(date["date_time"])

            yield {
                "network": informations["network"],
                "line": map_labels.get(informations["label"], informations["label"]),
                "headsign": informations["headsign"],
                "destination": pattern.sub("", informations["direction"]),
                "route": pattern.sub("", schedule["route"]["direction"]["name"]),
                "date_time": date_time.isoformat(),
            }


if __name__ == "__main__":
    print(
        json.dumps(
            [departure for departure in get_departures(5, "87682005")],
            indent=4,
        )
    )

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.settings import get_settings
from datetime import datetime
import requests
import re

settings = get_settings()


app = FastAPI(title=settings.app_title)

app.mount("/static", StaticFiles(directory=settings.root_dir / "static"), name="static")
templates = Jinja2Templates(directory=settings.root_dir / "templates")


def pull_departures(hours, stop_area_code):
    schedule_type = "terminus_schedules"
    url = f"https://api.navitia.io/v1/coverage/sncf/stop_areas/stop_area:SNCF:{stop_area_code}/{schedule_type}"

    headers = {"Authorization": settings.navitia_api_key}

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


@app.get("/api/departures")
async def get_departures(request: Request):
    departures = pull_departures(
        hours=settings.schedule_duration_hours,
        stop_area_code=settings.stop_area_code,
    )

    return sorted(departures, key=lambda x: x["date_time"])


@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "title": settings.app_title,
            "stop_area_title": settings.app_stop_area_title,
        },
    )

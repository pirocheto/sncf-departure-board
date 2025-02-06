from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

root_dir = Path(__file__).parent


class Settings(BaseSettings):
    root_dir: Path = root_dir

    # The title of the application and the title of the stop area should be displayed in the UI
    app_title: str = "SNCF Melun Departures"
    app_stop_area_title: str = "Melun"

    # To get an API key for SNCF region, you need to register on the following website:
    # https://numerique.sncf.com/startup/api/token-developpeur/
    # Set the API key in the .env file
    navitia_api_key: str = "your-api-key"

    # Navition use stop_area_code to identify the station you want to get the schedule from
    # You can get the stop_area_code by using the script get_stop_area.py
    stop_area_code: str = "87682005"  # Melun

    # The duration of the schedule in hours
    schedule_duration_hours: int = 4

    model_config = SettingsConfigDict(env_file=root_dir / ".env")


@lru_cache
def get_settings() -> Settings:
    return Settings()
